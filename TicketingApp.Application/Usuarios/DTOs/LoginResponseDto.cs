namespace TicketingApp.Application.Usuarios.DTOs;

public class LoginResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = null!;
    public string? Token { get; set; }
    public UserDto? User { get; set; }
}

public class UserDto
{
    public int Id { get; set; }
    public string UserName { get; set; } = null!;
    public string Email { get; set; } = null!;
}
