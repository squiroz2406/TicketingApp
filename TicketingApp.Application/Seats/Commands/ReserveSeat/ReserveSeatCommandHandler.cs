using System;
using System.Threading.Tasks;
using MediatR;
using TicketingApp.Application.Seats.Interfaces;
using TicketingApp.Application.Common.Interfaces;
using TicketingApp.Domain.Entities;

namespace TicketingApp.Application.Seats.Commands.ReserveSeat;

public class ReserveSeatCommandHandler : IRequestHandler<ReserveSeatCommand, bool>
{
    private readonly ISeatRepository _seatRepository;
    private readonly IReservationRepository _reservationRepository;
    private readonly IAuditLogRepository _auditLogRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ReserveSeatCommandHandler(
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

    public async Task<bool> Handle(ReserveSeatCommand request, CancellationToken cancellationToken)
    {
        var seat = await _seatRepository.GetByIdAsync(request.SeatId);
        if (seat == null || seat.Status != SeatStatus.Available)
        {
            return false;
        }

        // Change seat status
        seat.Status = SeatStatus.Reserved;
        await _seatRepository.UpdateAsync(seat);

        // Create reservation
        var reservation = new Reservation
        {
            SeatId = request.SeatId,
            UserId = request.UserId,
            Status = "Pending",
            ExpiresAt = DateTime.UtcNow.AddMinutes(15) // 15 minutes to confirm
        };
        await _reservationRepository.AddAsync(reservation);

        // Create audit log
        var auditLog = new AuditLog
        {
            UserId = request.UserId,
            Action = "Reserve",
            EntityType = "Seat",
            EntityId = request.SeatId.ToString(),
            Details = $"Seat {seat.RowIdentifier}{seat.SeatNumber} reserved{(seat.Sector != null ? $" for event {seat.Sector.EventId}" : string.Empty)}"
        };
        await _auditLogRepository.AddAsync(auditLog);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}