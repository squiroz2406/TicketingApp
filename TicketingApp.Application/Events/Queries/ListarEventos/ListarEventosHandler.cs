using TicketingApp.Application.Common.Interfaces;
using TicketingApp.Application.Events.DTOs;
using TicketingApp.Application.Events.Interfaces;

namespace TicketingApp.Application.Events.Queries.ListarEventos;

public class ListarEventosHandler 
    : IQueryHandler<ListarEventosQuery, List<EventoDto>>
{
    private readonly IEventoRepository _repository;

    public ListarEventosHandler(IEventoRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<EventoDto>> Handle(
        ListarEventosQuery query,
        CancellationToken cancellationToken)
    {
        var eventos = await _repository.GetAllAsync();

        return eventos.Select(e => new EventoDto
        {
            Id = e.Id,
            Nombre = e.Nombre,
            Fecha = e.Fecha
        }).ToList();
    }
}