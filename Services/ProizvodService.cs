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
            var connectionString = "mongodb://localhost/?safe=true";
            var client = new MongoClient(connectionString);
            var database = client.GetDatabase("products");
            var collection = database.GetCollection<BsonDocument>("products");
            
            var products = new List<string>();
            
            int pageSize = 5;
            
            int skip = (page - 1) * pageSize;
            var documents = collection.Find(new BsonDocument()).Skip(skip).Limit(pageSize).ToList();
            
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

