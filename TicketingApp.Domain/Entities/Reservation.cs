namespace TicketingApp.Domain.Entities;

public class Reservation
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public int UserId { get; set; }
    public Guid SeatId { get; set; }
    public Seat Seat { get; set; } = null!;

    public ReservationStatus Status { get; set; } = ReservationStatus.Pending;
    public DateTime ReservedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
}