using System;

namespace TicketingApp.Application.Butacas.DTOs;

public class ButacaDto
{
    public int Id { get; set; }
    public string Numero { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public int SectorId { get; set; }
}