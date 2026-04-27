using MediatR;
using TicketingApp.Application.Butacas.DTOs;
using TicketingApp.Application.Butacas.Interfaces;

namespace TicketingApp.Application.Butacas.Queries.GetDisponibilidad;

public class GetDisponibilidadQueryHandler : IRequestHandler<GetDisponibilidadQuery, List<ButacaDto>>
{
    private readonly IButacaRepository _butacaRepository;

    public GetDisponibilidadQueryHandler(IButacaRepository butacaRepository)
    {
        _butacaRepository = butacaRepository;
    }

    public async Task<List<ButacaDto>> Handle(GetDisponibilidadQuery request, CancellationToken cancellationToken)
    {
        var butacas = await _butacaRepository.GetByEventoIdAsync(request.EventoId);
        return butacas.Select(b => new ButacaDto
        {
            Id = b.Id,
            Numero = b.Numero,
            Estado = b.Estado.ToString(),
            SectorId = b.SectorId
        }).ToList();
    }
}