using System;
using MediatR;

namespace TicketingApp.Application.Seats.Commands.ConfirmReservation;

public record ConfirmReservationCommand(Guid ReservationId, int UserId) : IRequest<ConfirmReservationResult>;
