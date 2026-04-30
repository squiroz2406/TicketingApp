namespace TicketingApp.Application.Events.DTOs;

public class SectorDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Capacity { get; set; }
    public int AvailableSeats { get; set; }
}