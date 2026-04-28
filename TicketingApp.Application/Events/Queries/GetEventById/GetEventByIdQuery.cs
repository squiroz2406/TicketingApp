using MediatR;
using TicketingApp.Application.Events.DTOs;

namespace TicketingApp.Application.Events.Queries.GetEventById;

public record GetEventByIdQuery(int Id) : IRequest<EventDto>;