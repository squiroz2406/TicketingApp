using System;
using System.Linq;
using MediatR;
using TicketingApp.Application.Seats.DTOs;
using TicketingApp.Application.Seats.Interfaces;

namespace TicketingApp.Application.Seats.Queries.GetAvailability
{
    public class GetAvailabilityQueryHandler : IRequestHandler<GetAvailabilityQuery, List<SeatDto>>
    {
        private readonly ISeatRepository _seatRepository;

        public GetAvailabilityQueryHandler(ISeatRepository seatRepository)
        {
            _seatRepository = seatRepository;
        }

        public async Task<List<SeatDto>> Handle(GetAvailabilityQuery request, CancellationToken cancellationToken)
        {
            var seats = await _seatRepository.GetByEventIdAsync(request.EventId);
            return seats.Select(s => new SeatDto
            {
                Id = s.Id,
                Row = s.RowIdentifier,
                Col = s.SeatNumber,
                SeatNumber = $"{s.RowIdentifier}{s.SeatNumber}",
                Status = s.Status == SeatStatus.Available ? "available" : "occupied",
                SectorId = s.SectorId
            }).ToList();
        }
    }
}