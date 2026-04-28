using MediatR;
using TicketingApp.Application.Seats.DTOs;

namespace TicketingApp.Application.Seats.Queries.GetAvailability;

public record GetAvailabilityQuery(int EventId) : IRequest<List<SeatDto>>;