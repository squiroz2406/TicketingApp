using TicketingApp.Domain.Entities;
using TicketingApp.Application.Events.Interfaces;
using TicketingApp.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace TicketingApp.Infrastructure.Repositories
{
    public class EventRepository : IEventRepository
    {
        private readonly ApplicationDbContext _context;

        public EventRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Event?> GetByIdAsync(int id)
        {
            return await _context.Events.FindAsync(id);
        }

        public async Task<List<Event>> GetAllAsync()
        {
            return await _context.Events
                .Include(e => e.Sectors)
                .ToListAsync();
        }

        public async Task AddAsync(Event evento)
        {
            await _context.Events.AddAsync(evento);
        }

        public async Task UpdateAsync(Event evento)
        {
            _context.Events.Update(evento);
        }

        public async Task DeleteAsync(int id)
        {
            var evento = await GetByIdAsync(id);
            if (evento != null)
            {
                _context.Events.Remove(evento);
            }
        }

        public async Task<List<Sector>> GetSectorsByEventIdAsync(int eventId)
        {
            return await _context.Sectors
                .Where(s => s.EventId == eventId)
                .ToListAsync();
        }
    }
}