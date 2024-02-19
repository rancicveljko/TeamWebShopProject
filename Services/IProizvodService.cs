namespace WebShop.Services
{
    public interface IProizvodService
    {

        string[] GetProductList(int page);


        string GetProductDetails(string id);
    }

}

