using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TicketingApp.Infrastructure.Identity;

namespace TicketingApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UsersController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
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
