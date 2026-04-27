using MediatR;
using TicketingApp.Application.Events.Interfaces;
using TicketingApp.Application.Common.Interfaces;
using TicketingApp.Domain.Entities;

namespace TicketingApp.Application.Events.Commands.CreateEvento;

public class CreateEventoCommandHandler : IRequestHandler<CreateEventoCommand, int>
{
    private readonly IEventoRepository _eventoRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateEventoCommandHandler(IEventoRepository eventoRepository, IUnitOfWork unitOfWork)
    {
        _eventoRepository = eventoRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<int> Handle(CreateEventoCommand request, CancellationToken cancellationToken)
    {
        var evento = new Evento
        {
            Nombre = request.Nombre,
            Fecha = request.Fecha,
            Ubicacion = "Default", // Placeholder
            CapacidadTotal = 100 // Placeholder
        };

        await _eventoRepository.AddAsync(evento);
        await _unitOfWork.SaveChangesAsync();
        return evento.Id;
    }
}