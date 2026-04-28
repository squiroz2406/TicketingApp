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
                RowIdentifier = s.RowIdentifier,
                SeatNumber = s.SeatNumber,
                Status = s.Status.ToString(),
                SectorId = s.SectorId
            }).ToList();
        }
    }
}