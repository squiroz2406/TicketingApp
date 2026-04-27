using MediatR;
using TicketingApp.Application.Butacas.DTOs;

namespace TicketingApp.Application.Butacas.Queries.GetDisponibilidad;

public record GetDisponibilidadQuery(int EventoId) : IRequest<List<ButacaDto>>;