using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TicketingApp.Application.Common.Interfaces;
using TicketingApp.Application.Seats.Interfaces;
using TicketingApp.Domain.Entities;

namespace TicketingApp.Application.Seats.Commands.ReserveSeat;

public class ReserveSeatsCommandHandler : IRequestHandler<ReserveSeatsCommand, bool>
{
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

    public async Task<bool> Handle(ReserveSeatsCommand request, CancellationToken cancellationToken)
    {
        var seatIds = request.SeatIds?.Distinct().ToList() ?? new List<Guid>();
        if (!seatIds.Any())
        {
            return false;
        }

        var seats = new List<Seat>();
        foreach (var seatId in seatIds)
        {
            var seat = await _seatRepository.GetByIdAsync(seatId);
            if (seat == null || seat.Status != SeatStatus.Available)
            {
                return false;
            }
            seats.Add(seat);
        }

        foreach (var seat in seats)
        {
            seat.Status = SeatStatus.Reserved;
            await _seatRepository.UpdateAsync(seat);

            var reservation = new Reservation
            {
                SeatId = seat.Id,
                UserId = request.UserId,
                Status = "Pending",
                ExpiresAt = DateTime.UtcNow.AddMinutes(15)
            };
            await _reservationRepository.AddAsync(reservation);

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

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }
}
