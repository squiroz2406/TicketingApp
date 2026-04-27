using TicketingApp.Domain.Entities;

namespace TicketingApp.Application.Butacas.Interfaces;

public interface IButacaRepository
{
    Task<List<Butaca>> GetByEventoIdAsync(int eventoId);
}