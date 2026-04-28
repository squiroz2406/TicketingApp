using MediatR;
using TicketingApp.Application.Events.DTOs;

namespace TicketingApp.Application.Events.Queries.GetSectorsByEventId;

public class GetSectorsByEventIdQuery : IRequest<List<SectorDto>>
{
    public int EventId { get; set; }
}