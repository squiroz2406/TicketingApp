using TicketingApp.Domain.Entities;
using TicketingApp.Application.Common.Interfaces;
using TicketingApp.Infrastructure.Persistence;

namespace TicketingApp.Infrastructure.Repositories
{
    public class AuditLogRepository : IAuditLogRepository
    {
        private readonly ApplicationDbContext _context;

        public AuditLogRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(AuditLog auditLog)
        {
            await _context.AuditLogs.AddAsync(auditLog);
        }
    }
}