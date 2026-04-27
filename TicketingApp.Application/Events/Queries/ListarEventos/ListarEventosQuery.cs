using System;
using MediatR;
using System.Collections.Generic;
using TicketingApp.Application.Events.DTOs;

namespace TicketingApp.Application.Events.Queries.ListarEventos;

public record ListarEventosQuery : IRequest<List<EventoDto>>;