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
            
            await _context.SaveChangesAsync();
            var movies = new[]
            {
                "Dune: Parte Dos",
                "Oppenheimer",
                "Killers of the Flower Moon",
                "Barbie",
                "Godzilla x Kong",
                "Avatar 3",
                "The Flash",
                "Spider-Man: Beyond the Spider-Verse",
                "The Batman",
                "Top Gun: Maverick",
                "Guardians of the Galaxy Vol. 3",
                "Black Panther: Wakanda Forever"
            };
        
            var horarios = new[] { "14:30", "18:00", "21:00" };
        
            var events = new List<Event>();
        
            foreach (var movie in movies)
            {
                events.Add(new Event
                {
                    Name = movie,
                    EventDate = DateTime.Now,
                    Venue = "Sala Principal",
                    Status = "Active"
                });
            }
        
            await _context.Events.AddRangeAsync(events);
            await _context.SaveChangesAsync();
        
            var sectors = new List<Sector>();
        
            foreach (var ev in events)
            {
                foreach (var h in horarios)
                {
                    sectors.Add(new Sector
                    {
                        Name = h,
                        EventId = ev.Id,
                        Price = 100,
                        Capacity = 50
                    });
                }
            }
        
            await _context.Sectors.AddRangeAsync(sectors);
            await _context.SaveChangesAsync();
        
            var seats = new List<Seat>();
        
            foreach (var sector in sectors)
            {
                for (char row = 'A'; row <= 'E'; row++)
                {
                    for (int col = 1; col <= 10; col++)
                    {
                        seats.Add(new Seat
                        {
                            SectorId = sector.Id,
                            RowIdentifier = row.ToString(),
                            SeatNumber = col,
                            Status = SeatStatus.Available.ToString()
                        });
                    }
                }
            }
        
            await _context.Seats.AddRangeAsync(seats);
            await _context.SaveChangesAsync();
        
            return Ok("Base de datos poblada correctamente");
        }
    }
}