using WebShop.Models;

namespace WebShop.Services
{
    public interface IProizvodService
    {

        List<Proizvod> GetProductList(int page,string tag);


        Proizvod GetProductDetails(string id);
    }

}

