using MediatR;
using TicketingApp.Application.Events.Interfaces;
using TicketingApp.Application.Common.Interfaces;
using TicketingApp.Domain.Entities;

namespace TicketingApp.Application.Events.Commands.CreateEvent;

public class CreateEventCommandHandler : IRequestHandler<CreateEventCommand, int>
{
    private readonly IEventRepository _eventRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateEventCommandHandler(IEventRepository eventoRepository, IUnitOfWork unitOfWork)
    {
        _eventRepository = eventoRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<int> Handle(CreateEventCommand request, CancellationToken cancellationToken)
    {
        var evento = new Event
        {
            Name = request.Name,
            EventDate = request.EventDate,
            Venue = "Default", // Placeholder
            Status = "Active"
        };

        await _eventRepository.AddAsync(evento);
        await _unitOfWork.SaveChangesAsync();
        return evento.Id;
    }
}