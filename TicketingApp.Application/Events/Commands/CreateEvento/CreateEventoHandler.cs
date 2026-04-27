using TicketingApp.Application.Common.Interfaces;
using TicketingApp.Application.Events.Interfaces;

namespace TicketingApp.Application.Events.Commands.CreateEvento;

public class CreateEventoHandler 
    : ICommandHandler<CreateEventoCommand, int>
{
    private readonly IEventoRepository _repository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateEventoHandler(
        IEventoRepository repository,
        IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<int> Handle(
        CreateEventoCommand command,
        CancellationToken cancellationToken)
    {
        var evento = new Domain.Entities.Evento
        {
            Nombre = command.Nombre,
            Fecha = command.Fecha
        };

        await _repository.AddAsync(evento);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return evento.Id;
    }
}