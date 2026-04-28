using System.Collections.Generic;
using System.Linq;
using MediatR;
using TicketingApp.Application.Events.DTOs;
using TicketingApp.Application.Events.Interfaces;

namespace TicketingApp.Application.Events.Queries.ListEvents;

public class ListEventsQueryHandler : IRequestHandler<ListEventsQuery, List<EventDto>>
{
    private readonly IEventRepository _eventRepository;

    public ListEventsQueryHandler(IEventRepository eventoRepository)
    {
        _eventRepository = eventoRepository;
    }

    public async Task<List<EventDto>> Handle(ListEventsQuery request, CancellationToken cancellationToken)
    {
        var eventos = await _eventRepository.GetAllAsync();
        return eventos.Select(e => new EventDto
        {
            Id = e.Id,
            Name = e.Name,
            EventDate = e.EventDate,
            Venue = e.Venue
        }).ToList();
    }
}