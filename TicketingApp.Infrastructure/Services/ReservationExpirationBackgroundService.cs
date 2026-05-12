using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using TicketingApp.Domain.Entities;
using TicketingApp.Infrastructure.Persistence;

namespace TicketingApp.Infrastructure.Services;

public class ReservationExpirationBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<ReservationExpirationBackgroundService> _logger;

    public ReservationExpirationBackgroundService(
        IServiceScopeFactory scopeFactory,
        ILogger<ReservationExpirationBackgroundService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ExpirePendingReservationsAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error expiring reservations");
            }

            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }

    public async Task ExpirePendingReservationsAsync(CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var expiredReservations = await context.Reservations
            .Include(r => r.Seat)
            .Where(r => r.Status == ReservationStatus.Pending && r.ExpiresAt <= DateTime.UtcNow)
            .ToListAsync(cancellationToken);

        if (!expiredReservations.Any())
        {
            return;
        }

        foreach (var reservation in expiredReservations)
        {
            reservation.Status = ReservationStatus.Expired;
            if (reservation.Seat != null)
            {
                reservation.Seat.Status = SeatStatus.Available;
            }

            context.AuditLogs.Add(new AuditLog
            {
                UserId = reservation.UserId,
                Action = "ExpireReservation",
                EntityType = "Reservation",
                EntityId = reservation.Id.ToString(),
                Details = $"Reservation {reservation.Id} expired and seat {reservation.Seat?.RowIdentifier}{reservation.Seat?.SeatNumber} was released"
            });
        }

        await context.SaveChangesAsync(cancellationToken);
    }
}
