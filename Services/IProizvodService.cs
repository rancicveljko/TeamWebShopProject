using MongoDB.Bson;
using WebShop.Models;

namespace WebShop.Services
{
    public interface IProizvodService
    {
        List<Proizvod> GetProductList(int page, string tag);
        Proizvod GetProductDetails(ObjectId id);
        long GetTotalNumberOfProducts();
        void AddComment(ObjectId proizvodId, string komentar);
        string[] GetProductComments(ObjectId proizvodId);
        List<string> GetUniqueTags();
        void AddProduct(Proizvod proizvod);
        //void UpdateProduct(string id, Proizvod updatedProizvod);
        void UpdateProduct(ObjectId id, string name, int price, string[] tags);
        void DeleteProduct(ObjectId id);

    }

}

