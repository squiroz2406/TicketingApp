using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TicketingApp.Domain.Entities;
using TicketingApp.Infrastructure.Identity;


namespace TicketingApp.Infrastructure.Persistence;

public class ApplicationDbContext 
    : IdentityDbContext<ApplicationUser, IdentityRole<int>, int>
{
    public DbSet<Event> Events => Set<Event>();
    public DbSet<Sector> Sectors => Set<Sector>();
    public DbSet<Seat> Seats => Set<Seat>();
    public DbSet<Reservation> Reservations => Set<Reservation>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Event>().ToTable("Event");
        modelBuilder.Entity<Sector>().ToTable("Sector");
        modelBuilder.Entity<Seat>().ToTable("Seat");
        modelBuilder.Entity<Reservation>().ToTable("Reservation");
        modelBuilder.Entity<AuditLog>().ToTable("Audit_Log");
        modelBuilder.Entity<ApplicationUser>().ToTable("User");

        modelBuilder.Entity<Event>()
            .Property(e => e.EventDate)
            .HasColumnName("EventDate");

        modelBuilder.Entity<Event>()
            .Property(e => e.Venue)
            .HasColumnName("Venue");

        modelBuilder.Entity<Sector>()
            .Property(s => s.EventId)
            .HasColumnName("EventId");

        modelBuilder.Entity<Sector>()
            .Property(s => s.Name)
            .HasColumnName("Name");

        modelBuilder.Entity<Sector>()
            .Property(s => s.Price)
            .HasColumnName("Price");

        modelBuilder.Entity<Sector>()
            .Property(s => s.Capacity)
            .HasColumnName("Capacity");

        modelBuilder.Entity<Seat>()
            .Property(s => s.Version)
            .IsRowVersion()
            .HasColumnName("Version");

        modelBuilder.Entity<Seat>()
            .Property(s => s.Status)
            .HasColumnName("Status");

        modelBuilder.Entity<Reservation>()
            .Property(r => r.UserId)
            .HasColumnName("UserId");

        modelBuilder.Entity<Reservation>()
            .Property(r => r.SeatId)
            .HasColumnName("SeatId");

        modelBuilder.Entity<AuditLog>()
            .Property(a => a.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()");

        modelBuilder.Entity<ApplicationUser>()
            .Property(u => u.UserName)
            .HasColumnName("Name");
    }
}