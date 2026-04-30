using System;
using System.Collections.Generic;
using MediatR;

namespace TicketingApp.Application.Seats.Commands.ReserveSeat;

public record ReserveSeatsCommand(IEnumerable<Guid> SeatIds, int UserId) : IRequest<bool>;