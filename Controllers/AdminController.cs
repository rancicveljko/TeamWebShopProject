using WebShop.Models;
using WebShop.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace WebShop.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AdminController:ControllerBase
    {
        private readonly IAdminService adminService;

        public AdminController(IAdminService adminService, IConfiguration config)
        {
            this.adminService = adminService;
        }

    

        [HttpGet("GetAdminByEmail/{email}")]
        public async Task<IActionResult> GetAdminByEmail(string email)
        {
            var admin = await adminService.GetAdminByEmailAsync(email);

            if (admin == null)
            {
                return NotFound($"Admin with email = {email} not found");
            }

            return Ok(admin);
        }
        
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegistrationModelAdmin resource)
        {
            try
            {
                var response = await adminService.Register(resource);
                return Ok(response);
            }
            catch (Exception e)
            {
                return BadRequest(new { ErrorMessage = e.Message });
            }
        }
    }
}