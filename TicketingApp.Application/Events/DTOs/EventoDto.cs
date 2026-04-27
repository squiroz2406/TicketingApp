namespace TicketingApp.Application.Events.DTOs;

public class EventoDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;

    public DateTime Fecha { get; set; }

    public string Ubicacion { get; set; } = string.Empty;

    public int CapacidadTotal { get; set; }
}