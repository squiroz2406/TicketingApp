using System;
using MediatR;
using System.Collections.Generic;
using TicketingApp.Application.Events.DTOs;

namespace TicketingApp.Application.Events.Queries.ListEvents;

public record ListEventsQuery : IRequest<List<EventDto>>;