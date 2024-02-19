using Microsoft.AspNetCore.Mvc;

namespace WebShop.Controllers;

[ApiController]
[Route("[controller]")]
public class WebShopController : ControllerBase
{
    private readonly ILogger<WebShopController> _logger;
    public WebShopController(ILogger<WebShopController> logger)
    {
        _logger = logger;
    }
}