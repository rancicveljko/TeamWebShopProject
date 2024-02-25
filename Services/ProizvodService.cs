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
using Microsoft.Extensions.Options;

namespace WebShop.Services
{
    public class ProizvodService : IProizvodService
    {
        private readonly IMongoDatabase _database;
        private readonly MongoDbSettings _settings;

        public ProizvodService(IOptions<MongoDbSettings> options)
        {
            _settings = options.Value;
            var client = new MongoClient(_settings.ConnectionString);
            _database = client.GetDatabase(_settings.DatabaseName);
        }

        public List<Proizvod> GetProductList(int page, string tag)
        {
            var collection = _database.GetCollection<Proizvod>(_settings.CollectionName);

            int pageSize = 8;
            int skip = (page - 1) * pageSize;

            FilterDefinition<Proizvod> combinedFilter;

            if (!string.IsNullOrWhiteSpace(tag))
            {
                var filter = Builders<Proizvod>.Filter.AnyEq(x => x.Tags, tag);
                combinedFilter = Builders<Proizvod>.Filter.Empty & filter;
            }
            else
            {
                combinedFilter = Builders<Proizvod>.Filter.Empty;
            }

            var products = collection.Find(combinedFilter).Skip(skip).Limit(pageSize).ToList();

            return products;
        }

        public Proizvod GetProductDetails(string id)
        {
            var collection = _database.GetCollection<Proizvod>(_settings.CollectionName);
            var filter = Builders<Proizvod>.Filter.Eq("Id", id);
            return collection.Find(filter).FirstOrDefault();

        }
        public long GetTotalNumberOfProducts()
        {
            var collection = _database.GetCollection<Proizvod>(_settings.CollectionName);
            return collection.CountDocuments(Builders<Proizvod>.Filter.Empty);
        }

        public void AddComment(int id, string komentar)
        {

            var collection = _database.GetCollection<Proizvod>(_settings.CollectionName);     
            collection.FindOneAndUpdate(
            Builders<Proizvod>.Filter.Eq(p => p.Id, id),
            Builders<Proizvod>.Update.AddToSet(p => p.Comments, komentar));
        
        }

        public string[] GetProductComments(string id)
        {
            var collection = _database.GetCollection<Proizvod>(_settings.CollectionName);
            var filter = Builders<Proizvod>.Filter.Eq("Id", id);
            var proizvod = collection.Find(filter).FirstOrDefault();
            return proizvod?.Comments ?? new string[0];
        }

        public List<string> GetUniqueTags()
        {
            var collection = _database.GetCollection<Proizvod>(_settings.CollectionName);
            var uniqueTags = collection.Distinct<string>("Tags", Builders<Proizvod>.Filter.Empty).ToList();
            return uniqueTags;
        }
    }
}



