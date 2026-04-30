using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketingApp.Domain.Entities;
using TicketingApp.Infrastructure.Identity;
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
            // Clear existing data to avoid duplicates
            _context.Reservations.RemoveRange(_context.Reservations);
            _context.Seats.RemoveRange(_context.Seats);
            _context.Sectors.RemoveRange(_context.Sectors);
            _context.Events.RemoveRange(_context.Events);
            _context.AuditLogs.RemoveRange(_context.AuditLogs);
            _context.Users.RemoveRange(_context.Users);
            await _context.SaveChangesAsync();
            
            var seedUser = new ApplicationUser
            {
                Id = 1,
                UserName = "guest",
                NormalizedUserName = "GUEST",
                Email = "guest@example.com",
                NormalizedEmail = "GUEST@EXAMPLE.COM",
                EmailConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString(),
                ConcurrencyStamp = Guid.NewGuid().ToString()
            };

            _context.Database.OpenConnection();
            try
            {
                _context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [User] ON");
                await _context.Users.AddAsync(seedUser);
                await _context.SaveChangesAsync();
                _context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [User] OFF");
            }
            finally
            {
                _context.Database.CloseConnection();
            }

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
                            Status = SeatStatus.Available
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