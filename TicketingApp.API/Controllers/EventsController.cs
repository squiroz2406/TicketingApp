using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketingApp.Application.Events.Commands.CreateEvent;
using TicketingApp.Application.Events.DTOs;
using TicketingApp.Application.Events.Queries.ListEvents;
using TicketingApp.Application.Events.Queries.GetEventById;
using TicketingApp.Application.Seats.Queries.GetAvailability;

namespace TicketingApp.API.Controllers;

[ApiController]
[Route("api/v1/events")]
public class EventsController : ControllerBase
{
    private readonly IMediator _mediator;

    public EventsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var result = await _mediator.Send(new ListEventsQuery());
        return Ok(result);
    }

    [HttpGet("{id}/seats")]
    public async Task<IActionResult> GetSeats(int id)
    {
        var result = await _mediator.Send(new GetAvailabilityQuery(id));
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateEventCommand command)
    {
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(Get), new { id }, id);
    }
}