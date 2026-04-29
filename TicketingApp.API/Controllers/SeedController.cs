using System;
using System.Linq;
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
            _context.AuditLogs.RemoveRange(_context.AuditLogs);
            _context.Reservations.RemoveRange(_context.Reservations);
            _context.Seats.RemoveRange(_context.Seats);
            _context.Sectors.RemoveRange(_context.Sectors);
            _context.Events.RemoveRange(_context.Events);
            await _context.SaveChangesAsync();

            var movies = new[]
            {
                new { Name = "Dune: Parte Dos", Date = new System.DateTime(2026, 5, 15, 20, 30), Venue = "Sala 1" },
                new { Name = "Oppenheimer", Date = new System.DateTime(2026, 5, 16, 19, 0), Venue = "Sala 2" },
                new { Name = "Killers of the Flower Moon", Date = new System.DateTime(2026, 5, 17, 21, 0), Venue = "Sala 3" },
                new { Name = "Barbie", Date = new System.DateTime(2026, 5, 18, 18, 30), Venue = "Sala 1" },
                new { Name = "Godzilla x Kong", Date = new System.DateTime(2026, 5, 19, 20, 0), Venue = "Sala 2" },
                new { Name = "Avatar 3", Date = new System.DateTime(2026, 5, 20, 22, 0), Venue = "Sala 4" },
                new { Name = "The Flash", Date = new System.DateTime(2026, 5, 21, 17, 0), Venue = "Sala 5" },
                new { Name = "Spider-Man: Beyond the Spider-Verse", Date = new System.DateTime(2026, 5, 22, 20, 30), Venue = "Sala 3" }
            };

            foreach (var movie in movies)
            {
                var evento = new Event
                {
                    Name = movie.Name,
                    EventDate = movie.Date,
                    Venue = movie.Venue,
                    Status = "Active"
                };

                await _context.Events.AddAsync(evento);
                await _context.SaveChangesAsync();

                var sectors = new[]
                {
                    new { Name = "14:30", Price = 70.00m },
                    new { Name = "20:30", Price = 90.00m }
                };

                foreach (var sectorData in sectors)
                {
                    var sector = new Sector
                    {
                        Name = sectorData.Name,
                        EventId = evento.Id,
                        Price = sectorData.Price,
                        Capacity = 50
                    };

                    await _context.Sectors.AddAsync(sector);
                    await _context.SaveChangesAsync();

                    for (char row = 'A'; row <= 'E'; row++)
                    {
                        for (int col = 1; col <= 10; col++)
                        {
                            var seat = new Seat
                            {
                                RowIdentifier = row.ToString(),
                                SeatNumber = col,
                                SectorId = sector.Id,
                                Status = SeatStatus.Available.ToString()
                            };

                            await _context.Seats.AddAsync(seat);
                        }
                    }

                    await _context.SaveChangesAsync();
                }
            }

            return Ok("Database seeded successfully");
        }
    }
}