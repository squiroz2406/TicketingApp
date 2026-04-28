using TicketingApp.Domain.Entities;

namespace TicketingApp.Application.Common.Interfaces;

public interface IAuditLogRepository
{
    Task AddAsync(AuditLog auditLog);
}