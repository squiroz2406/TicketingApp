using TicketingApp.Domain.Entities;
using TicketingApp.Application.Seats.Interfaces;
using TicketingApp.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace TicketingApp.Infrastructure.Repositories
{
    public class SeatRepository : ISeatRepository
    {
        private readonly ApplicationDbContext _context;

        public SeatRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Seat?> GetByIdAsync(Guid id)
        {
            return await _context.Seats.FindAsync(id);
        }

        public async Task<List<Seat>> GetByEventIdAsync(int eventId)
        {
            return await _context.Seats
                .Where(s => s.Sector.EventId == eventId)
                .Include(s => s.Sector)
                .ToListAsync();
        }

        public async Task<List<Seat>> GetAllAsync()
        {
            return await _context.Seats.Include(s => s.Sector).ToListAsync();
        }

        public async Task AddAsync(Seat seat)
        {
            await _context.Seats.AddAsync(seat);
        }

        public async Task UpdateAsync(Seat seat)
        {
            _context.Seats.Update(seat);
        }

        public async Task DeleteAsync(Guid id)
        {
            var seat = await GetByIdAsync(id);
            if (seat != null)
            {
                _context.Seats.Remove(seat);
            }
        }
    }
}