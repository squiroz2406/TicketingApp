using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TicketingApp.Domain.Entities;
using TicketingApp.Infrastructure.Identity;


namespace TicketingApp.Infrastructure.Persistence;

public class ApplicationDbContext 
    : IdentityDbContext<ApplicationUser, IdentityRole<int>, int>
{
    public DbSet<Evento> Eventos => Set<Evento>();
    public DbSet<Sector> Sectores => Set<Sector>();
    public DbSet<Butaca> Butacas => Set<Butaca>();
    public DbSet<Reserva> Reservas => Set<Reserva>();

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Butaca>()
            .Property(b => b.RowVersion)
            .IsRowVersion();
    }
}