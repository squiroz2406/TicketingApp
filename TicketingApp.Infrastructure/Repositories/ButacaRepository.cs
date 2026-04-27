using Microsoft.EntityFrameworkCore;
using TicketingApp.Application.Butacas.Interfaces;
using TicketingApp.Domain.Entities;
using TicketingApp.Infrastructure.Persistence;

namespace TicketingApp.Infrastructure.Repositories;

public class ButacaRepository : IButacaRepository
{
    private readonly ApplicationDbContext _context;

    public ButacaRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Butaca>> GetByEventoIdAsync(int eventoId)
    {
        return await _context.Butacas
            .Where(b => b.Sector.EventoId == eventoId)
            .Include(b => b.Sector)
            .ToListAsync();
    }
}