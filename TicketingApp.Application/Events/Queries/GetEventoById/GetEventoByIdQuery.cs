using MediatR;
using TicketingApp.Application.Events.DTOs;

namespace TicketingApp.Application.Events.Queries.GetEventoById;

public record GetEventoByIdQuery(int Id) : IRequest<EventoDto>;