using Microsoft.AspNetCore.Mvc;
using TicketingApp.Domain.Entities;
using TicketingApp.Infrastructure.Persistence;

namespace TicketingApp.API.Controllers;

[ApiController]
[Route("api/v1/seed")]
public class SeedController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SeedController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Seed()
    {
        // Crear evento
        var evento = new Evento
        {
            Nombre = "Concierto de Rock 2026",
            Fecha = new DateTime(2026, 5, 15, 20, 0, 0),
            Ubicacion = "Arena 1",
            CapacidadTotal = 100
        };

        await _context.Eventos.AddAsync(evento);
        await _context.SaveChangesAsync();

        // Crear sector
        var sector = new Sector
        {
            Nombre = "Sector A",
            EventoId = evento.Id
        };

        await _context.Sectores.AddAsync(sector);
        await _context.SaveChangesAsync();

        // Crear 100 butacas (10x10)
        for (int i = 1; i <= 100; i++)
        {
            var butaca = new Butaca
            {
                Numero = $"A{i}",
                SectorId = sector.Id,
                Estado = EstadoButaca.Available
            };
            await _context.Butacas.AddAsync(butaca);
        }

        await _context.SaveChangesAsync();

        return Ok(new { eventoId = evento.Id, butacas = 100 });
    }
}
