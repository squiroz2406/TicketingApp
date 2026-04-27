using Microsoft.EntityFrameworkCore;
using TicketingApp.Application.Events.Interfaces;
using TicketingApp.Domain.Entities;
using TicketingApp.Infrastructure.Persistence;

namespace TicketingApp.Infrastructure.Repositories;

public class EventoRepository : IEventoRepository
{
    private readonly ApplicationDbContext _context;

    public EventoRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Evento evento)
    {
        await _context.Eventos.AddAsync(evento);
    }

    public async Task<List<Evento>> GetAllAsync()
    {
        return await _context.Eventos.ToListAsync();
    }

    public async Task<Evento?> GetByIdAsync(int id)
    {
        return await _context.Eventos.FindAsync(id);
    }
}