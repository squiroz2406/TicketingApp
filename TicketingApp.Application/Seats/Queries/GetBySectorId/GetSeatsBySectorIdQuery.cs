using MediatR;
using TicketingApp.Application.Seats.DTOs;

namespace TicketingApp.Application.Seats.Queries.GetBySectorId;

public record GetSeatsBySectorIdQuery(int SectorId) : IRequest<List<SeatDto>>;
