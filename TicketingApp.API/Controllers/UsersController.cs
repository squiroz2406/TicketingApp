using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TicketingApp.Application.Common.Interfaces;
using TicketingApp.Application.Usuarios.DTOs;
using TicketingApp.Infrastructure.Identity;

namespace TicketingApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAuthenticationService _authenticationService;

        public UsersController(UserManager<ApplicationUser> userManager, IAuthenticationService authenticationService)
        {
            _userManager = userManager;
            _authenticationService = authenticationService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authenticationService.LoginAsync(request);
            
            if (!result.Success)
                return Unauthorized(result);

            return Ok(result);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authenticationService.RegisterAsync(request);
            
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpPost("create-test-user")]
        public async Task<IActionResult> CreateTestUser()
        {
            var user = new ApplicationUser
            {
                UserName = "testuser",
                Email = "test@example.com",
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user, "Password123!");
            
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok(new { userId = user.Id, userName = user.UserName });
        }
    }
}
