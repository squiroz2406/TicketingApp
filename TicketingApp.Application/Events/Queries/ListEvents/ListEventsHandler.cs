using TicketingApp.Application.Common.Interfaces;
using TicketingApp.Application.Events.DTOs;
using TicketingApp.Application.Events.Interfaces;

namespace TicketingApp.Application.Events.Queries.ListEvents;

public class ListEventsHandler 
    : IQueryHandler<ListEventsQuery, List<EventDto>>
{
    private readonly IEventRepository _repository;

    public ListEventsHandler(IEventRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<EventDto>> Handle(
        ListEventsQuery query,
        CancellationToken cancellationToken)
    {
        var eventos = await _repository.GetAllAsync();

        return eventos.Select(e => new EventDto
        {
            Id = e.Id,
            Name = e.Name,
            EventDate = e.EventDate
        }).ToList();
    }
}