using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketingApp.Application.Seats.Commands.ReserveSeat;

namespace TicketingApp.API.Controllers;

[ApiController]
[Route("api/v1/reservations")]
public class ReservationsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ReservationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Reserve([FromBody] ReserveSeatCommand command)
    {
        var result = await _mediator.Send(command);
        if (result)
        {
            return Ok();
        }
        else
        {
            return Conflict("Seat ocupada");
        }
    }
}