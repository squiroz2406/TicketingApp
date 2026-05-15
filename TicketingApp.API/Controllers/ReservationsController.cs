using MediatR;
using Microsoft.AspNetCore.Mvc;
using TicketingApp.Application.Seats.Commands.ConfirmReservation;
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
    public async Task<IActionResult> Reserve([FromBody] ReserveSeatsCommand command)
    {
        var result = await _mediator.Send(command);
        if (result.Success)
        {
            return Ok(new { success = true, reservationId = result.ReservationId });
        }

        return Conflict(new { success = false, message = result.Message ?? "Algunas butacas ya estaban reservadas o no existen" });
    }

    [HttpPost("{id:guid}/confirm")]
    public async Task<IActionResult> Confirm([FromRoute] Guid id, [FromBody] ConfirmReservationCommand command)
    {
        if (command.ReservationId != id)
        {
            return BadRequest(new { success = false, message = "Reservation id mismatch" });
        }

        var result = await _mediator.Send(command);
        if (result.Success)
        {
            return Ok(new { success = true });
        }

        return Conflict(new { success = false, message = result.Message ?? "Conflict confirming reservation" });
    }
}