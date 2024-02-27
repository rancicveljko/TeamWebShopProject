using System.Web;
using Microsoft.AspNetCore.Mvc;
using WebShop.Services;
using WebShop.Models;
using MongoDB.Bson;

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
        public IActionResult GetProductDetails(ObjectId id)
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

        [HttpPost("add-comment/{id}/{comment}")]
        public IActionResult AddComment(ObjectId id, string comment)
        {
            if (string.IsNullOrEmpty(comment))
            {
                return BadRequest("Comment cannot be empty.");
            }

            _proizvodService.AddComment(id, comment);
            return Ok("Comment successfully added.");
        }

        [HttpGet("product-comments/{id}")]
        public IActionResult GetProductComments(ObjectId id)
        {
            var comment = _proizvodService.GetProductComments(id);
            return Ok(comment);
        }

        [HttpGet("unique-tags")]
        public IActionResult GetUniqueTags()
        {
            var uniqueTags = _proizvodService.GetUniqueTags();
            return Ok(uniqueTags);
        }
        [HttpPost("add-product")]
        public IActionResult AddProduct(Proizvod proizvod)
        {
            _proizvodService.AddProduct(proizvod);
            return NoContent();
        }

        [HttpPut("update-product/{id}/{name}/{price}/{tags}")]
        public IActionResult UpdateProduct(ObjectId id, string name, int price, string tags)
        {
            string[] tagsArray = tags.Split(',');
            _proizvodService.UpdateProduct(id, name, price, tagsArray);
            return NoContent();
        }


        [HttpDelete("delete-product/{id}")]
        public IActionResult DeleteProduct(ObjectId id)
        {
            _proizvodService.DeleteProduct(id);
            return NoContent();
        }
    }
}
