using MediatR;
using TicketingApp.Application.Events.DTOs;
using TicketingApp.Application.Events.Interfaces;

namespace TicketingApp.Application.Events.Queries.GetSectorsByEventId;

public class GetSectorsByEventIdQueryHandler : IRequestHandler<GetSectorsByEventIdQuery, List<SectorDto>>
{
    private readonly IEventRepository _eventRepository;

    public GetSectorsByEventIdQueryHandler(IEventRepository eventRepository)
    {
        _eventRepository = eventRepository;
    }

    public async Task<List<SectorDto>> Handle(GetSectorsByEventIdQuery request, CancellationToken cancellationToken)
    {
        var sectors = await _eventRepository.GetSectorsByEventIdAsync(request.EventId);

        return sectors.Select(s => new SectorDto
        {
            Id = s.Id,
            Name = s.Name,
            Price = s.Price,
            Capacity = s.Capacity
        }).ToList();
    }
}