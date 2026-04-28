using TicketingApp.Domain.Entities;
using TicketingApp.Application.Common.Interfaces;
using TicketingApp.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace TicketingApp.Infrastructure.Repositories
{
    public class ReservationRepository : IReservationRepository
    {
        private readonly ApplicationDbContext _context;

        public ReservationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Reservation?> GetByIdAsync(Guid id)
        {
            return await _context.Reservations.FindAsync(id);
        }

        public async Task<List<Reservation>> GetByUserIdAsync(int userId)
        {
            return await _context.Reservations
                .Where(r => r.UserId == userId)
                .Include(r => r.Seat)
                .ThenInclude(s => s.Sector)
                .ToListAsync();
        }

        public async Task<List<Reservation>> GetBySeatIdAsync(Guid seatId)
        {
            return await _context.Reservations
                .Where(r => r.SeatId == seatId)
                .ToListAsync();
        }

        public async Task AddAsync(Reservation reservation)
        {
            await _context.Reservations.AddAsync(reservation);
        }

        public async Task UpdateAsync(Reservation reservation)
        {
            _context.Reservations.Update(reservation);
        }

        public async Task DeleteAsync(Guid id)
        {
            var reservation = await GetByIdAsync(id);
            if (reservation != null)
            {
                _context.Reservations.Remove(reservation);
            }
        }
    }
}