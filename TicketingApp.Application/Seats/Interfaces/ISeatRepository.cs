using TicketingApp.Domain.Entities;

namespace TicketingApp.Application.Seats.Interfaces;

public interface ISeatRepository
{
    Task<Seat?> GetByIdAsync(Guid id);
    Task<List<Seat>> GetByEventIdAsync(int eventId);
    Task<List<Seat>> GetBySectorIdAsync(int sectorId);
    Task<List<Seat>> GetAllAsync();
    Task AddAsync(Seat entity);
    Task UpdateAsync(Seat entity);
    Task DeleteAsync(Guid id);
}