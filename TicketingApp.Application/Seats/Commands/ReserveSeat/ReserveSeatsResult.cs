using System;
using System.Collections.Generic;

namespace TicketingApp.Application.Seats.Commands.ReserveSeat;

public class ReserveSeatsResult
{
    public bool Success { get; set; }
    public Guid ReservationId { get; set; }
    public IEnumerable<Guid> ReservationIds { get; set; } = Array.Empty<Guid>();
}
