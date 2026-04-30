using TicketingApp.Application.Usuarios.DTOs;

namespace TicketingApp.Application.Common.Interfaces;

public interface IAuthenticationService
{
    Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
    Task<LoginResponseDto> RegisterAsync(RegisterRequestDto request);
}
