namespace TicketingApp.Application.Common.Interfaces;

public interface IQueryHandler<TQuery, TResponse>
{
    Task<TResponse> Handle(TQuery query, CancellationToken cancellationToken);
}