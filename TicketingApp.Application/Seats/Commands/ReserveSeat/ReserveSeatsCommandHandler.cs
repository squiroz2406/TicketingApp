using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TicketingApp.Application.Common.Interfaces;
using TicketingApp.Application.Seats.Interfaces;
using TicketingApp.Domain.Entities;

namespace TicketingApp.Application.Seats.Commands.ReserveSeat;

public class ReserveSeatsCommandHandler : IRequestHandler<ReserveSeatsCommand, ReserveSeatsResult>
{
    private const int MAX_SEATS_PER_RESERVATION = 6;
    private readonly ISeatRepository _seatRepository;
    private readonly IReservationRepository _reservationRepository;
    private readonly IAuditLogRepository _auditLogRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ReserveSeatsCommandHandler(
        ISeatRepository seatRepository,
        IReservationRepository reservationRepository,
        IAuditLogRepository auditLogRepository,
        IUnitOfWork unitOfWork)
    {
        _seatRepository = seatRepository;
        _reservationRepository = reservationRepository;
        _auditLogRepository = auditLogRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ReserveSeatsResult> Handle(ReserveSeatsCommand request, CancellationToken cancellationToken)
    {
        var seatIds = request.SeatIds?.Distinct().ToList() ?? new List<Guid>();
        if (!seatIds.Any())
        {
            return new ReserveSeatsResult { Success = false, Message = "No seats provided" };
        }

        // Validar que no se excedan las 6 butacas máximas por compra
        if (seatIds.Count > MAX_SEATS_PER_RESERVATION)
        {
            return new ReserveSeatsResult 
            { 
                Success = false, 
                Message = $"No puedes reservar más de {MAX_SEATS_PER_RESERVATION} butacas por compra" 
            };
        }

        var seats = new List<Seat>();
        foreach (var seatId in seatIds)
        {
            var seat = await _seatRepository.GetByIdAsync(seatId);
            if (seat == null)
            {
                return new ReserveSeatsResult { Success = false, Message = "One or more seats not found" };
            }

            if (seat.Status == SeatStatus.Reserved)
            {
                var pendingReservations = await _reservationRepository.GetPendingBySeatIdAsync(seatId);
                var expiredReservations = pendingReservations.Where(r => r.ExpiresAt <= DateTime.UtcNow).ToList();

                foreach (var expiredReservation in expiredReservations)
                {
                    expiredReservation.Status = ReservationStatus.Expired;
                    if (expiredReservation.Seat != null)
                    {
                        expiredReservation.Seat.Status = SeatStatus.Available;
                    }

                    await _reservationRepository.UpdateAsync(expiredReservation);

                    var expiredAudit = new AuditLog
                    {
                        UserId = expiredReservation.UserId,
                        Action = "ExpireReservation",
                        EntityType = "Reservation",
                        EntityId = expiredReservation.Id.ToString(),
                        Details = $"Reservation {expiredReservation.Id} expired and seat {expiredReservation.Seat?.RowIdentifier}{expiredReservation.Seat?.SeatNumber} was released"
                    };
                    await _auditLogRepository.AddAsync(expiredAudit);
                }

                if (expiredReservations.Any())
                {
                    seat.Status = SeatStatus.Available;
                }
            }

            if (seat.Status != SeatStatus.Available)
            {
                return new ReserveSeatsResult { Success = false, Message = "One or more seats are not available" };
            }

            seats.Add(seat);
        }

        var reservationIds = new List<Guid>();
        foreach (var seat in seats)
        {
            seat.Status = SeatStatus.Reserved;
            await _seatRepository.UpdateAsync(seat);

            var reservation = new Reservation
            {
                SeatId = seat.Id,
                UserId = request.UserId,
                Status = ReservationStatus.Pending,
                ReservedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddMinutes(5)
            };
            await _reservationRepository.AddAsync(reservation);
            reservationIds.Add(reservation.Id);

            var auditLog = new AuditLog
            {
                UserId = request.UserId,
                Action = "Reserve",
                EntityType = "Seat",
                EntityId = seat.Id.ToString(),
                Details = $"Seat {seat.RowIdentifier}{seat.SeatNumber} reserved{(seat.Sector != null ? $" for event {seat.Sector.EventId}" : string.Empty)}"
            };
            await _auditLogRepository.AddAsync(auditLog);
        }

        try
        {
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return new ReserveSeatsResult
            {
                Success = true,
                ReservationIds = reservationIds,
                ReservationId = reservationIds.FirstOrDefault()
            };
        }
        catch (DbUpdateConcurrencyException)
        {
            return new ReserveSeatsResult { Success = false, Message = "Concurrency error. Please try again" };
        }
    }
}
