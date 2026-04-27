using System;
using MediatR;

namespace TicketingApp.Application.Events.Commands.CreateEvento;

public record CreateEventoCommand(string Nombre, DateTime Fecha) : IRequest<int>;