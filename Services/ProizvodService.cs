// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Runtime.Serialization;
// using System.ServiceModel;
// using System.ServiceModel.Activation;
// using System.Text;
using MongoDB.Driver;
using MongoDB.Bson;

namespace WebShop.Services
{
    public class ProizvodService : IProizvodService
    {

        public string[] GetProductList(int page)
        {
            //return new string[] {"{\"_id\":1, \"name\":\"Proizvod 1\", \"imageURL\":\"1.jpg\"}",
            //                    "{\"_id\":2, \"name\":\"Proizvod 2\", \"imageURL\":\"2.jpg\"}",
            //                    "{\"_id\":3, \"name\":\"Proizvod 3\", \"imageURL\":\"3.jpg\"}",
            //                    "{\"_id\":4, \"name\":\"Proizvod 4\", \"imageURL\":\"4.jpg\"}",
            //                    "{\"_id\":5, \"name\":\"Proizvod 5\", \"imageURL\":\"5.jpg\"}",
            //                    "{\"_id\":6, \"name\":\"Proizvod 6\", \"imageURL\":\"6.jpg\"}",
            //                    "{\"_id\":7, \"name\":\"Proizvod 7\", \"imageURL\":\"7.jpg\"}",
            //                    "{\"_id\":8, \"name\":\"Proizvod 8\", \"imageURL\":\"8.jpg\"}",
            //                    "{\"_id\":9, \"name\":\"Proizvod 9\", \"imageURL\":\"9.jpg\"}"};
            
            var connectionString = "mongodb://localhost/?safe=true";
            var client = new MongoClient(connectionString);
            var database = client.GetDatabase("products");
            var collection = database.GetCollection<BsonDocument>("products");
            //var collection = database.GetCollection<Product>("products");

            var products = new List<string>();
            
            var documents = collection.Find(new BsonDocument()).ToList();
            
            foreach (var doc in documents)
            {
                products.Add(doc.ToJson());
            }

            return products.ToArray();
                                    
        }


        public string GetProductDetails(string id)
        {
            return string.Empty;
        }
    }

}

