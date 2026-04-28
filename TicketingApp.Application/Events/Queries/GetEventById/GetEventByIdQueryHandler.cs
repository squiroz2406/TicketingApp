using MediatR;
using TicketingApp.Application.Events.DTOs;
using TicketingApp.Application.Events.Interfaces;

namespace TicketingApp.Application.Events.Queries.GetEventById;

public class GetEventByIdQueryHandler : IRequestHandler<GetEventByIdQuery, EventDto>
{
    private readonly IEventRepository _eventRepository;

    public GetEventByIdQueryHandler(IEventRepository eventoRepository)
    {
        _eventRepository = eventoRepository;
    }

    public async Task<EventDto> Handle(GetEventByIdQuery request, CancellationToken cancellationToken)
    {
        var evento = await _eventRepository.GetByIdAsync(request.Id);
        if (evento == null) throw new KeyNotFoundException("Event not found");

        return new EventDto
        {
            Id = evento.Id,
            Name = evento.Name,
            EventDate = evento.EventDate,
            Venue = evento.Venue,
            Status = evento.Status
        };
    }
}