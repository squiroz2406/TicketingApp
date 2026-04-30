using System.Collections.Generic;
using System.Linq;
using MediatR;
using TicketingApp.Application.Events.DTOs;
using TicketingApp.Application.Events.Interfaces;
using TicketingApp.Domain.Entities;

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
            Venue = e.Venue,
            Sectors = e.Sectors?.Select(s => new SectorDto
            {
                Id = s.Id,
                Name = s.Name,
                Price = s.Price,
                Capacity = s.Capacity,
                AvailableSeats = s.Seats?.Count(seat => seat.Status == SeatStatus.Available) ?? 0
            }).ToList() ?? new List<SectorDto>()
        }).ToList();
    }
}