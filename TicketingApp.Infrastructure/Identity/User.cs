using Microsoft.AspNetCore.Identity;
using TicketingApp.Domain.Entities;

namespace TicketingApp.Infrastructure.Identity;

public class ApplicationUser : IdentityUser<int>
{
    public List<Reservation> Reservations { get; set; } = new();
    public List<AuditLog> AuditLogs { get; set; } = new();
}