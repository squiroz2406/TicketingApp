namespace TicketingApp.Application.Events.Commands.CreateEvento;

public class CreateEventoCommand
{
    public string Nombre { get; set; } = string.Empty;
    public DateTime Fecha { get; set; }
}