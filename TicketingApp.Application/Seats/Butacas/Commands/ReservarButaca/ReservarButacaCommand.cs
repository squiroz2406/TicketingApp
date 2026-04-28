using MediatR;

namespace TicketingApp.Application.Seats.Commands.ReserveSeat;

public record ReserveSeatCommand(Guid SeatId, int UserId) : IRequest<bool>;