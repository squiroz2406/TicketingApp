using Microsoft.AspNetCore.Mvc;
using TicketingApp.Domain.Entities;
using TicketingApp.Infrastructure.Persistence;

namespace TicketingApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SeedController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("seed")]
        public async Task<IActionResult> SeedDatabase()
        {
            // Crear evento
            var evento = new Event
            {
                Name = "Concierto de Rock 2026",
                EventDate = new DateTime(2026, 5, 15, 20, 0, 0),
                Venue = "Arena 1",
                Status = "Active"
            };

            await _context.Events.AddAsync(evento);
            await _context.SaveChangesAsync();

            // Crear sector
            var sector = new Sector
            {
                Name = "Sector A",
                EventId = evento.Id,
                Price = 50.00m,
                Capacity = 100
            };

            await _context.Sectors.AddAsync(sector);
            await _context.SaveChangesAsync();

            // Crear 100 asientos (10x10)
            for (int i = 1; i <= 10; i++)
            {
                for (int j = 1; j <= 10; j++)
                {
                    var seat = new Seat
                    {
                        RowIdentifier = $"Fila {i}",
                        SeatNumber = j,
                        SectorId = sector.Id,
                        Status = SeatStatus.Available.ToString()
                    };

                    await _context.Seats.AddAsync(seat);
                }
            }

            await _context.SaveChangesAsync();

            return Ok("Database seeded successfully");
        }
    }
}