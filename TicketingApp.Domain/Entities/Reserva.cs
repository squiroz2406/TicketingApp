namespace TicketingApp.Domain.Entities;

public class Reserva
{
    public int Id { get; set; }

    public int ButacaId { get; set; }
    public Butaca Butaca { get; set; } = null!;

    public int UsuarioId { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }

    public bool Confirmada { get; set; } = false;
}