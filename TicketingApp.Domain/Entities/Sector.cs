namespace TicketingApp.Domain.Entities;

public class Sector
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;

    public int EventoId { get; set; }
    public Evento Evento { get; set; } = null!;

    public List<Butaca> Butacas { get; set; } = new();
}