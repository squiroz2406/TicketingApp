namespace TicketingApp.Domain.Entities;

public class Seat
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public int SectorId { get; set; }
    public Sector Sector { get; set; } = null!;

    public string RowIdentifier { get; set; } = string.Empty;
    public int SeatNumber { get; set; }
    public SeatStatus Status { get; set; } = SeatStatus.Available;

    // Para control de concurrencia
    public byte[] Version { get; set; } = Array.Empty<byte>();
}