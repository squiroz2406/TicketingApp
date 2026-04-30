using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TicketingApp.Application.Common.Interfaces;
using TicketingApp.Application.Usuarios.DTOs;
using TicketingApp.Infrastructure.Identity;

namespace TicketingApp.Infrastructure.Services;

public class AuthenticationService : IAuthenticationService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;

    public AuthenticationService(UserManager<ApplicationUser> userManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
    {
        try
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return new LoginResponseDto
                {
                    Success = false,
                    Message = "Usuario o contraseña incorrectos"
                };
            }

            var result = await _userManager.CheckPasswordAsync(user, request.Password);
            if (!result)
            {
                return new LoginResponseDto
                {
                    Success = false,
                    Message = "Usuario o contraseña incorrectos"
                };
            }

            var token = GenerateJwtToken(user);

            return new LoginResponseDto
            {
                Success = true,
                Message = "Login exitoso",
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    UserName = user.UserName ?? string.Empty,
                    Email = user.Email ?? string.Empty
                }
            };
        }
        catch (Exception ex)
        {
            return new LoginResponseDto
            {
                Success = false,
                Message = $"Error durante el login: {ex.Message}"
            };
        }
    }

    public async Task<LoginResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        try
        {
            if (request.Password != request.ConfirmPassword)
            {
                return new LoginResponseDto
                {
                    Success = false,
                    Message = "Las contraseñas no coinciden"
                };
            }

            var userExists = await _userManager.FindByEmailAsync(request.Email);
            if (userExists != null)
            {
                return new LoginResponseDto
                {
                    Success = false,
                    Message = "El usuario ya existe"
                };
            }

            var user = new ApplicationUser
            {
                UserName = request.UserName,
                Email = request.Email,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return new LoginResponseDto
                {
                    Success = false,
                    Message = $"Error al registrar: {errors}"
                };
            }

            return new LoginResponseDto
            {
                Success = true,
                Message = "Registro exitoso",
                User = new UserDto
                {
                    Id = user.Id,
                    UserName = user.UserName ?? string.Empty,
                    Email = user.Email ?? string.Empty
                }
            };
        }
        catch (Exception ex)
        {
            return new LoginResponseDto
            {
                Success = false,
                Message = $"Error durante el registro: {ex.Message}"
            };
        }
    }

    private string GenerateJwtToken(ApplicationUser user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
        );
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddMinutes(
            int.Parse(_configuration["Jwt:ExpirationMinutes"] ?? "60")
        );

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
            new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
