using System.Collections.Generic;
using System.Linq;
using MediatR;
using TicketingApp.Application.Events.DTOs;
using TicketingApp.Application.Events.Interfaces;

namespace TicketingApp.Application.Events.Queries.ListarEventos;

public class ListarEventosQueryHandler : IRequestHandler<ListarEventosQuery, List<EventoDto>>
{
    private readonly IEventoRepository _eventoRepository;

    public ListarEventosQueryHandler(IEventoRepository eventoRepository)
    {
        _eventoRepository = eventoRepository;
    }

    public async Task<List<EventoDto>> Handle(ListarEventosQuery request, CancellationToken cancellationToken)
    {
        var eventos = await _eventoRepository.GetAllAsync();
        return eventos.Select(e => new EventoDto
        {
            Id = e.Id,
            Nombre = e.Nombre,
            Fecha = e.Fecha,
            Ubicacion = e.Ubicacion,
            CapacidadTotal = e.CapacidadTotal
        }).ToList();
    }
}