using TicketingApp.Domain.Entities;

namespace TicketingApp.Application.Common.Interfaces;

public interface IReservationRepository
{
    Task<Reservation?> GetByIdAsync(Guid id);
    Task<List<Reservation>> GetByUserIdAsync(int userId);
    Task<List<Reservation>> GetBySeatIdAsync(Guid seatId);
    Task AddAsync(Reservation reservation);
    Task UpdateAsync(Reservation reservation);
    Task DeleteAsync(Guid id);
}