using MediatR;

namespace TicketingApp.Application.Butacas.Commands.ReservarButaca;

public record ReservarButacaCommand(int SeatId, int UserId) : IRequest<bool>;