using TicketingApp.Application.Common.Interfaces;
using TicketingApp.Application.Events.Interfaces;

namespace TicketingApp.Application.Events.Commands.CreateEvent;

public class CreateEventHandler 
    : ICommandHandler<CreateEventCommand, int>
{
    private readonly IEventRepository _repository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateEventHandler(
        IEventRepository repository,
        IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<int> Handle(
        CreateEventCommand command,
        CancellationToken cancellationToken)
    {
        var evento = new Domain.Entities.Event
        {
            Name = command.Name,
            EventDate = command.EventDate
        };

        await _repository.AddAsync(evento);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return evento.Id;
    }
}