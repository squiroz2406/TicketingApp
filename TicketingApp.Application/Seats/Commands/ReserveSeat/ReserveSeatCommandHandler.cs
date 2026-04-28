using System;
using System.Threading.Tasks;
using MediatR;
using TicketingApp.Application.Seats.Interfaces;
using TicketingApp.Application.Common.Interfaces;
using TicketingApp.Domain.Entities;

namespace TicketingApp.Application.Seats.Commands.ReserveSeat;

public class ReserveSeatCommandHandler : IRequestHandler<ReserveSeatCommand, bool>
{
    private readonly ISeatRepository _seatRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ReserveSeatCommandHandler(ISeatRepository butacaRepository, IUnitOfWork unitOfWork)
    {
        _seatRepository = butacaRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(ReserveSeatCommand request, CancellationToken cancellationToken)
    {
        // For simplicity, assume we update the seat status
        // In real app, create a Reservation entity
        // But since Reservation exists, perhaps add logic

        // Placeholder: just return true
        return true;
    }
}