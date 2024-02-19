using Microsoft.AspNetCore.Mvc;
using WebShop.Services;

namespace WebShop.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WebShopController : ControllerBase
    {
        private readonly IProizvodService _proizvodService;

        public WebShopController(IProizvodService proizvodService)
        {
            _proizvodService = proizvodService;
        }

        [HttpGet("product-list/{page}")]
        public IActionResult GetProductList(int page)
        {
            var productList = _proizvodService.GetProductList(page);
            return Ok(productList);
        }

        [HttpGet("product-details/{id}")]
        public IActionResult GetProductDetails(string id)
        {
            var productDetails = _proizvodService.GetProductDetails(id);
            if (string.IsNullOrEmpty(productDetails))
            {
                return NotFound();
            }
            return Ok(productDetails);
        }
    }
}
