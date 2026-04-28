using TicketingApp.Domain.Entities;

namespace TicketingApp.Application.Events.Interfaces;

public interface IEventRepository
{
    Task<Event?> GetByIdAsync(int id);
    Task<List<Event>> GetAllAsync();
    Task AddAsync(Event entity);
    Task UpdateAsync(Event entity);
    Task DeleteAsync(int id);
    Task<List<Sector>> GetSectorsByEventIdAsync(int eventId);
}