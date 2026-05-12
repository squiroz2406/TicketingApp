using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using MediatR;
using TicketingApp.Application.Seats.Commands.ConfirmReservation;
using TicketingApp.Application.Seats.Commands.ReserveSeat;
using TicketingApp.Domain.Entities;
using TicketingApp.Infrastructure;
using TicketingApp.Infrastructure.Identity;
using TicketingApp.Infrastructure.Persistence;
using TicketingApp.Infrastructure.Repositories;
using TicketingApp.Application.Common.Interfaces;
using TicketingApp.Application.Seats.Interfaces;

namespace TicketingApp.Tests;

public class ReservationConcurrencyTests : IAsyncLifetime
{
    private ApplicationDbContext _context = null!;
    private IMediator _mediator = null!;
    private IUnitOfWork _unitOfWork = null!;
    private ISeatRepository _seatRepository = null!;
    private IReservationRepository _reservationRepository = null!;
    private IAuditLogRepository _auditLogRepository = null!;
    private Event _event = null!;
    private Sector _sector = null!;

    public async Task InitializeAsync()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _context = new ApplicationDbContext(options);
        await _context.Database.EnsureCreatedAsync();

        _unitOfWork = new UnitOfWork(_context);
        _seatRepository = new SeatRepository(_context);
        _reservationRepository = new ReservationRepository(_context);
        _auditLogRepository = new AuditLogRepository(_context);

        // Setup MediatR with handlers
        var serviceCollection = new Microsoft.Extensions.DependencyInjection.ServiceCollection();
        serviceCollection.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(TicketingApp.Application.Events.DTOs.EventDto).Assembly));
        serviceCollection.AddScoped<ISeatRepository>(_ => _seatRepository);
        serviceCollection.AddScoped<IReservationRepository>(_ => _reservationRepository);
        serviceCollection.AddScoped<IAuditLogRepository>(_ => _auditLogRepository);
        serviceCollection.AddScoped<IUnitOfWork>(_ => _unitOfWork);

        var provider = serviceCollection.BuildServiceProvider();
        _mediator = provider.GetRequiredService<IMediator>();

        // Create test data
        _event = new Event { EventDate = DateTime.UtcNow.AddDays(1), Venue = "Test Hall", Name = "Test Event" };
        _context.Events.Add(_event);
        await _context.SaveChangesAsync();

        _sector = new Sector { EventId = _event.Id, Name = "A", Price = 50, Capacity = 10 };
        _context.Sectors.Add(_sector);
        await _context.SaveChangesAsync();

        // Create test seats
        for (int i = 1; i <= 3; i++)
        {
            var seat = new Seat
            {
                SectorId = _sector.Id,
                RowIdentifier = "A",
                SeatNumber = i,
                Status = SeatStatus.Available
            };
            _context.Seats.Add(seat);
        }
        await _context.SaveChangesAsync();
    }

    public async Task DisposeAsync()
    {
        await _context.DisposeAsync();
    }

    [Fact]
    public async Task TwoReservationRequestsForSameSeat_OnlyOneSucceeds()
    {
        // Arrange
        var seat = await _seatRepository.GetByIdAsync(_context.Seats.First().Id);
        var seatId = seat!.Id;
        var userId1 = 1;
        var userId2 = 2;

        // Act: Two concurrent reservations for the same seat
        var task1 = _mediator.Send(new ReserveSeatsCommand(new[] { seatId }, userId1));
        var task2 = _mediator.Send(new ReserveSeatsCommand(new[] { seatId }, userId2));

        await Task.WhenAll(task1, task2);

        var result1 = await task1;
        var result2 = await task2;

        // Assert: Only one should succeed
        var successCount = (result1?.Success ?? false ? 1 : 0) + (result2?.Success ?? false ? 1 : 0);
        Assert.Equal(1, successCount);

        // Verify seat status
        var finalSeat = await _seatRepository.GetByIdAsync(seatId);
        Assert.Equal(SeatStatus.Reserved, finalSeat!.Status);

        // Verify only one reservation
        var reservations = await _reservationRepository.GetBySeatIdAsync(seatId);
        Assert.Single(reservations);
    }

    [Fact]
    public async Task ReservationExpiration_SeatBecomesAvailable()
    {
        // Arrange
        var seat = await _seatRepository.GetByIdAsync(_context.Seats.Skip(1).First().Id);
        var seatId = seat!.Id;

        // Act: Reserve with past expiration date
        var command = new ReserveSeatsCommand(new[] { seatId }, 1);
        var result = await _mediator.Send(command);

        Assert.True(result.Success);

        // Get the reservation and manually expire it
        var reservations = await _reservationRepository.GetBySeatIdAsync(seatId);
        var reservation = reservations.First();
        reservation.ExpiresAt = DateTime.UtcNow.AddMinutes(-1);
        await _reservationRepository.UpdateAsync(reservation);
        await _unitOfWork.SaveChangesAsync();

        // Act: Try to confirm an expired reservation
        var confirmCommand = new ConfirmReservationCommand(reservation.Id, 1);
        var confirmResult = await _mediator.Send(confirmCommand);

        // Assert: Should fail and seat should be available
        Assert.False(confirmResult.Success);
        Assert.Contains("expired", confirmResult.Message, StringComparison.OrdinalIgnoreCase);

        var finalSeat = await _seatRepository.GetByIdAsync(seatId);
        Assert.Equal(SeatStatus.Available, finalSeat!.Status);

        // Verify reservation status is expired
        var updatedReservation = await _reservationRepository.GetByIdAsync(reservation.Id);
        Assert.Equal(ReservationStatus.Expired, updatedReservation!.Status);
    }

    [Fact]
    public async Task ConfirmReservation_ChangesStatusToConfirmed()
    {
        // Arrange
        var seat = await _seatRepository.GetByIdAsync(_context.Seats.Skip(2).First().Id);
        var seatId = seat!.Id;
        var userId = 1;

        // Act: Reserve
        var reserveCommand = new ReserveSeatsCommand(new[] { seatId }, userId);
        var reserveResult = await _mediator.Send(reserveCommand);
        Assert.True(reserveResult.Success);

        var reservations = await _reservationRepository.GetBySeatIdAsync(seatId);
        var reservation = reservations.First();

        // Act: Confirm
        var confirmCommand = new ConfirmReservationCommand(reservation.Id, userId);
        var confirmResult = await _mediator.Send(confirmCommand);

        // Assert
        Assert.True(confirmResult.Success);

        var updatedReservation = await _reservationRepository.GetByIdAsync(reservation.Id);
        Assert.Equal(ReservationStatus.Confirmed, updatedReservation!.Status);

        var finalSeat = await _seatRepository.GetByIdAsync(seatId);
        Assert.Equal(SeatStatus.Sold, finalSeat!.Status);
    }

    [Fact]
    public async Task AuditLog_RecordsAllOperations()
    {
        // Arrange
        var seat = await _seatRepository.GetByIdAsync(_context.Seats.First().Id);
        var seatId = seat!.Id;
        var userId = 1;

        // Act: Reserve and Confirm
        var reserveCommand = new ReserveSeatsCommand(new[] { seatId }, userId);
        var reserveResult = await _mediator.Send(reserveCommand);

        var reservations = await _reservationRepository.GetBySeatIdAsync(seatId);
        var reservation = reservations.First();

        var confirmCommand = new ConfirmReservationCommand(reservation.Id, userId);
        await _mediator.Send(confirmCommand);

        // Assert: Check audit logs
        var auditLogs = _context.AuditLogs.ToList();

        Assert.Equal(2, auditLogs.Count);

        var orderedLogs = auditLogs.OrderBy(a => a.CreatedAt).ToList();

        Assert.Collection(orderedLogs,
            reserve =>
            {
                Assert.Equal("Reserve", reserve.Action);
                Assert.Equal("Seat", reserve.EntityType);
                Assert.Equal(seatId.ToString(), reserve.EntityId);
            },
            confirm =>
            {
                Assert.Equal("ConfirmReservation", confirm.Action);
                Assert.Equal("Reservation", confirm.EntityType);
                Assert.Equal(reservation.Id.ToString(), confirm.EntityId);
            });
    }

    [Fact]
    public async Task MultipleSeatsReservation_AllOrNone()
    {
        // Arrange
        var seats = _context.Seats.Take(2).ToList();
        var seatIds = seats.Select(s => s.Id).ToArray();

        // Act: Reserve multiple seats
        var command = new ReserveSeatsCommand(seatIds, 1);
        var result = await _mediator.Send(command);

        // Assert
        Assert.True(result.Success);

        foreach (var seatId in seatIds)
        {
            var seat = await _seatRepository.GetByIdAsync(seatId);
            Assert.Equal(SeatStatus.Reserved, seat!.Status);
        }

        var reservations = _context.Reservations.Where(r => r.UserId == 1).ToList();
        Assert.Equal(seatIds.Length, reservations.Count);
    }
}
