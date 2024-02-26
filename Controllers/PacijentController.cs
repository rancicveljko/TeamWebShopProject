using WebShop.Models;
using WebShop.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace Ambulanta.Controllers;

[ApiController]
[Route("[controller]")]
public class KorisnikController : ControllerBase
{
    private readonly IKorisnikService korisnikService;
    private readonly string _pepper;
    private readonly int _iteration;

    public KorisnikController(IKorisnikService korisnikService, IConfiguration config)
    {
        this.korisnikService = korisnikService;
        _pepper = config["PasswordHasher:Pepper"];
        _iteration = config.GetValue<int>("PasswordHasher:Iteration");
    }


    [HttpGet("GetKorisnikByEmail/{email}")]
    public async Task<IActionResult> GetKorisnikByEmail(string email)
    {
        var korisnik = await korisnikService.GetKorisnikByEmailAsync(email);

        if (korisnik == null)
        {
            return NotFound($"Korisnik with email = {email} not found");
        }

        return Ok(korisnik);
    }


    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegistrationModel resource)
    {
        try
        {
            var response = await korisnikService.Register(resource);
            return Ok(response);
        }
        catch (Exception e)
        {
            return BadRequest(new { ErrorMessage = e.Message });
        }
    }

}