using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketingApp.Application.Seats.Queries.GetBySectorId;

namespace TicketingApp.API.Controllers;

[ApiController]
[Route("api/v1/sectors")]
public class SectorsController : ControllerBase
{
    private readonly IMediator _mediator;

    public SectorsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{id}/seats")]
    public async Task<IActionResult> GetSeats(int id)
    {
        var result = await _mediator.Send(new GetSeatsBySectorIdQuery(id));
        return Ok(result);
    }
}
