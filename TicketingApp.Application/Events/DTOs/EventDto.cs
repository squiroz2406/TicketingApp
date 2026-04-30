namespace TicketingApp.Application.Events.DTOs;

public class EventDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public DateTime EventDate { get; set; }

    public string Venue { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public List<SectorDto> Sectors { get; set; } = new();
} 