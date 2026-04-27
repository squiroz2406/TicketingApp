using MediatR;
using TicketingApp.Application.Events.DTOs;
using TicketingApp.Application.Events.Interfaces;

namespace TicketingApp.Application.Events.Queries.GetEventoById;

public class GetEventoByIdQueryHandler : IRequestHandler<GetEventoByIdQuery, EventoDto>
{
    private readonly IEventoRepository _eventoRepository;

    public GetEventoByIdQueryHandler(IEventoRepository eventoRepository)
    {
        _eventoRepository = eventoRepository;
    }

    public async Task<EventoDto> Handle(GetEventoByIdQuery request, CancellationToken cancellationToken)
    {
        var evento = await _eventoRepository.GetByIdAsync(request.Id);
        if (evento == null) throw new KeyNotFoundException("Evento not found");

        return new EventoDto
        {
            Id = evento.Id,
            Nombre = evento.Nombre,
            Fecha = evento.Fecha,
            Ubicacion = evento.Ubicacion,
            CapacidadTotal = evento.CapacidadTotal
        };
    }
}