using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TicketingApp.Application.Common.Interfaces;
using TicketingApp.Application.Seats.Interfaces;
using TicketingApp.Domain.Entities;

namespace TicketingApp.Application.Seats.Commands.ConfirmReservation;

public class ConfirmReservationCommandHandler : IRequestHandler<ConfirmReservationCommand, ConfirmReservationResult>
{
    private readonly ISeatRepository _seatRepository;
    private readonly IReservationRepository _reservationRepository;
    private readonly IAuditLogRepository _auditLogRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ConfirmReservationCommandHandler(
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

    public async Task<ConfirmReservationResult> Handle(ConfirmReservationCommand request, CancellationToken cancellationToken)
    {
        var reservation = await _reservationRepository.GetByIdAsync(request.ReservationId);
        if (reservation == null)
        {
            return new ConfirmReservationResult { Success = false, Message = "Reservation not found" };
        }

        if (reservation.Status != ReservationStatus.Pending)
        {
            return new ConfirmReservationResult { Success = false, Message = "Reservation is not pending" };
        }

        if (reservation.ExpiresAt <= DateTime.UtcNow)
        {
            reservation.Status = ReservationStatus.Expired;
            await _reservationRepository.UpdateAsync(reservation);

            var seat = await _seatRepository.GetByIdAsync(reservation.SeatId);
            if (seat != null && seat.Status == SeatStatus.Reserved)
            {
                seat.Status = SeatStatus.Available;
                await _seatRepository.UpdateAsync(seat);
            }

            var expiredAudit = new AuditLog
            {
                UserId = request.UserId,
                Action = "ExpireReservation",
                EntityType = "Reservation",
                EntityId = reservation.Id.ToString(),
                Details = $"Reservation {reservation.Id} expired before confirmation"
            };
            await _auditLogRepository.AddAsync(expiredAudit);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new ConfirmReservationResult { Success = false, Message = "Reservation has expired" };
        }

        var seatToConfirm = await _seatRepository.GetByIdAsync(reservation.SeatId);
        if (seatToConfirm == null)
        {
            return new ConfirmReservationResult { Success = false, Message = "Seat not found" };
        }

        if (seatToConfirm.Status != SeatStatus.Reserved)
        {
            return new ConfirmReservationResult { Success = false, Message = "Seat is not reserved" };
        }

        seatToConfirm.Status = SeatStatus.Sold;
        reservation.Status = ReservationStatus.Confirmed;

        await _seatRepository.UpdateAsync(seatToConfirm);
        await _reservationRepository.UpdateAsync(reservation);

        var auditLog = new AuditLog
        {
            UserId = request.UserId,
            Action = "ConfirmReservation",
            EntityType = "Reservation",
            EntityId = reservation.Id.ToString(),
            Details = $"Reservation {reservation.Id} confirmed and seat {seatToConfirm.RowIdentifier}{seatToConfirm.SeatNumber} sold"
        };
        await _auditLogRepository.AddAsync(auditLog);

        try
        {
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return new ConfirmReservationResult { Success = true };
        }
        catch (DbUpdateConcurrencyException)
        {
            return new ConfirmReservationResult { Success = false, Message = "Conflict updating reservation" };
        }
    }
}
