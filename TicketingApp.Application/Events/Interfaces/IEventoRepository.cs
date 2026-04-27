using System.Collections.Generic;
using System.Threading.Tasks;

namespace TicketingApp.Application.Events.Interfaces;

public interface IEventoRepository
{
    Task AddAsync(Domain.Entities.Evento evento);
    Task<List<Domain.Entities.Evento>> GetAllAsync();
    Task<Domain.Entities.Evento?> GetByIdAsync(int id);
}