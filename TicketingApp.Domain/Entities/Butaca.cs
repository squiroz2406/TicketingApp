namespace TicketingApp.Domain.Entities;

public class Butaca
{
    public int Id { get; set; }
    public string Numero { get; set; } = string.Empty;

    public int SectorId { get; set; }
    public Sector Sector { get; set; } = null!;

    public EstadoButaca Estado { get; set; } = EstadoButaca.Available;

    // 🔥 Optimistic Locking
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();
}