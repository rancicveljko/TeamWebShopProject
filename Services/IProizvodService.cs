using WebShop.Models;

namespace WebShop.Services
{
    public interface IProizvodService
    {
        List<Proizvod> GetProductList(int page, string tag);
        Proizvod GetProductDetails(string id);
        long GetTotalNumberOfProducts();
        void AddComment(int proizvodId, string komentar);
        string[] GetProductComments(string proizvodId);
        List<string> GetUniqueTags();
        void AddProduct(Proizvod proizvod);
        //void UpdateProduct(string id, Proizvod updatedProizvod);
        void UpdateProduct(string id, string name, int price, string[] tags);
        void DeleteProduct(string id);

    }

}

