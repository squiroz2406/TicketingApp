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

        // Table mappings
        modelBuilder.Entity<Event>().ToTable("Event");
        modelBuilder.Entity<Sector>().ToTable("Sector");
        modelBuilder.Entity<Seat>().ToTable("Seat");
        modelBuilder.Entity<Reservation>().ToTable("Reservation");
        modelBuilder.Entity<AuditLog>().ToTable("Audit_Log");
        modelBuilder.Entity<ApplicationUser>().ToTable("User");

        // Event configuration
        modelBuilder.Entity<Event>()
            .Property(e => e.EventDate)
            .HasColumnName("EventDate");

        modelBuilder.Entity<Event>()
            .Property(e => e.Venue)
            .HasColumnName("Venue");

        // Sector configuration
        modelBuilder.Entity<Sector>()
            .HasOne(s => s.Event)
            .WithMany(e => e.Sectors)
            .HasForeignKey(s => s.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Sector>()
            .Property(s => s.EventId)
            .HasColumnName("EventId");

        modelBuilder.Entity<Sector>()
            .Property(s => s.Name)
            .HasColumnName("Name");

        modelBuilder.Entity<Sector>()
            .Property(s => s.Price)
            .HasPrecision(18, 2)  
            .HasColumnName("Price");

        modelBuilder.Entity<Sector>()
            .Property(s => s.Capacity)
            .HasColumnName("Capacity");

        // Seat configuration
        modelBuilder.Entity<Seat>()
            .HasOne(s => s.Sector)
            .WithMany(se => se.Seats)
            .HasForeignKey(s => s.SectorId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Seat>()
            .Property(s => s.SectorId)
            .HasColumnName("SectorId");

        modelBuilder.Entity<Seat>()
            .Property(s => s.RowIdentifier)
            .HasColumnName("RowIdentifier");

        modelBuilder.Entity<Seat>()
            .Property(s => s.SeatNumber)
            .HasColumnName("SeatNumber");

        modelBuilder.Entity<Seat>()
            .Property(s => s.Version)
            .IsRowVersion()
            .HasColumnName("Version");

        modelBuilder.Entity<Seat>()
            .Property(s => s.Status)
            .HasColumnName("Status");

        // Reservation configuration
        modelBuilder.Entity<Reservation>()
            .HasOne<ApplicationUser>()
            .WithMany(u => u.Reservations)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Reservation>()
            .HasOne(r => r.Seat)
            .WithMany()
            .HasForeignKey(r => r.SeatId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Reservation>()
            .Property(r => r.UserId)
            .HasColumnName("UserId");

        modelBuilder.Entity<Reservation>()
            .Property(r => r.SeatId)
            .HasColumnName("SeatId");

        modelBuilder.Entity<Reservation>()
            .Property(r => r.Status)
            .HasColumnName("Status");

        modelBuilder.Entity<Reservation>()
            .Property(r => r.ReservedAt)
            .HasColumnName("ReservedAt");

        modelBuilder.Entity<Reservation>()
            .Property(r => r.ExpiresAt)
            .HasColumnName("ExpiresAt");

        // AuditLog configuration
        modelBuilder.Entity<AuditLog>()
            .HasOne<ApplicationUser>()
            .WithMany(u => u.AuditLogs)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<AuditLog>()
            .Property(a => a.UserId)
            .HasColumnName("UserId");

        modelBuilder.Entity<AuditLog>()
            .Property(a => a.Action)
            .HasColumnName("Action");

        modelBuilder.Entity<AuditLog>()
            .Property(a => a.EntityType)
            .HasColumnName("EntityType");

        modelBuilder.Entity<AuditLog>()
            .Property(a => a.EntityId)
            .HasColumnName("EntityId");

        modelBuilder.Entity<AuditLog>()
            .Property(a => a.Details)
            .HasColumnName("Details");

        modelBuilder.Entity<AuditLog>()
            .Property(a => a.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()")
            .HasColumnName("CreatedAt");

        // ApplicationUser configuration
        modelBuilder.Entity<ApplicationUser>()
            .Property(u => u.UserName)
            .HasColumnName("Name");
    }
}