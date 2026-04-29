using System;

namespace TicketingApp.Application.Seats.DTOs;

public class SeatDto
{
    public Guid Id { get; set; }
    public string Row { get; set; } = string.Empty;
    public int Col { get; set; }
    public string SeatNumber { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int SectorId { get; set; }
}