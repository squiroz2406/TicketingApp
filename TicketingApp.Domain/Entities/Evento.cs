namespace TicketingApp.Domain.Entities;

public class Evento
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public DateTime Fecha { get; set; }
    public string Ubicacion { get; set; } = string.Empty;
    public int CapacidadTotal { get; set; }

    public List<Sector> Sectores { get; set; } = new();
}