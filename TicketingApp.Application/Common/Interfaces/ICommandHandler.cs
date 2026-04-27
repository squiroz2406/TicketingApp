namespace TicketingApp.Application.Common.Interfaces;

public interface ICommandHandler<TCommand, TResponse>
{
    Task<TResponse> Handle(TCommand command, CancellationToken cancellationToken);
}