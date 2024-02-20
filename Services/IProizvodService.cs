using WebShop.Models;

namespace WebShop.Services
{
    public interface IProizvodService
    {

        string[] GetProductList(int page,string tag);


        Proizvod GetProductDetails(string id);
    }

}

