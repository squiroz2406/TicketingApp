using System;
using System.Linq;
using MediatR;
using TicketingApp.Application.Seats.DTOs;
using TicketingApp.Application.Seats.Interfaces;

namespace TicketingApp.Application.Seats.Queries.GetBySectorId;

public class GetSeatsBySectorIdQueryHandler : IRequestHandler<GetSeatsBySectorIdQuery, List<SeatDto>>
{
    private readonly ISeatRepository _seatRepository;

    public GetSeatsBySectorIdQueryHandler(ISeatRepository seatRepository)
    {
        _seatRepository = seatRepository;
    }

    public async Task<List<SeatDto>> Handle(GetSeatsBySectorIdQuery request, CancellationToken cancellationToken)
    {
        var seats = await _seatRepository.GetBySectorIdAsync(request.SectorId);
        return seats.Select(s => new SeatDto
        {
            Id = s.Id,
            Row = s.RowIdentifier,
            Col = s.SeatNumber,
            SeatNumber = $"{s.RowIdentifier}{s.SeatNumber}",
            Status = s.Status.Equals("Available", StringComparison.OrdinalIgnoreCase) ? "available" : "occupied",
            SectorId = s.SectorId
        }).ToList();
    }
}
