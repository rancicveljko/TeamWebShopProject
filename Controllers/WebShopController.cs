using System.Web;
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
        public IActionResult GetProductList(int page, [FromQuery] string tag = null)
        {
            var decTag = HttpUtility.UrlDecode(tag);
            var productList = _proizvodService.GetProductList(page, decTag);
            return Ok(productList);
        }

        [HttpGet("product-details/{id}")]
        public IActionResult GetProductDetails(string id)
        {
            var productDetails = _proizvodService.GetProductDetails(id);
            if (productDetails == null)
            {
                return NotFound();
            }
            return Ok(productDetails);
        }

        [HttpGet("total-products")]
        public IActionResult GetTotalProducts()
        {
            var totalProducts = _proizvodService.GetTotalNumberOfProducts();
            return Ok(totalProducts);
        }
    }
}
