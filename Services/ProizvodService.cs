// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Runtime.Serialization;
// using System.ServiceModel;
// using System.ServiceModel.Activation;
// using System.Text;
using MongoDB.Driver;
using MongoDB.Bson;
using WebShop.Models;
using System.Collections.ObjectModel;

namespace WebShop.Services
{
    public class ProizvodService : IProizvodService
    {
        
       
        

        public string[] GetProductList(int page, string tag)
        {
            var connectionString = "mongodb://localhost/?safe=true";
            var client = new MongoClient(connectionString);
            var database = client.GetDatabase("products");
            var collection = database.GetCollection<Proizvod>("products");
         
         
            
            var products = new List<string>();
            
            int pageSize = 5;
            
            int skip = (page - 1) * pageSize;
            
            FilterDefinition<Proizvod> combinedFilter;

            if (!string.IsNullOrWhiteSpace(tag))
            {
                var filter = Builders<Proizvod>.Filter.AnyEq(x => x.Tags, tag);
                combinedFilter = Builders<Proizvod>.Filter.Empty & filter;
            }
            else
            {
                // Ako tag nije pružen, koristimo prazan filter koji odgovara svim dokumentima
                combinedFilter = Builders<Proizvod>.Filter.Empty;
            }

            var documents = collection.Find(combinedFilter).Skip(skip).Limit(pageSize).ToList();
            
            foreach (var doc in documents)
            {
                products.Add(doc.ToJson());
            }

            return products.ToArray();    
        }
            
            public Proizvod GetProductDetails(string id)
            {
                var connectionString = "mongodb://localhost/?safe=true";
                var client = new MongoClient(connectionString);
                var database = client.GetDatabase("products");
                var collection = database.GetCollection<Proizvod>("products");
                var filter = Builders<Proizvod>.Filter.Eq("Id", id);
                return collection.Find(filter).FirstOrDefault();
    
            }                           
        }
}



