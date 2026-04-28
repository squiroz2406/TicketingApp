using System;
using MediatR;

namespace TicketingApp.Application.Events.Commands.CreateEvent;

public record CreateEventCommand(string Name, DateTime EventDate) : IRequest<int>;