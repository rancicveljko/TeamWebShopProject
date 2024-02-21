using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WebShop.Models
{
    [BsonIgnoreExtraElements]

    public class Proizvod
    {
        [BsonId]
        public int Id { get; set; }
        [BsonElement("name")]
        public string Name { get; set; }
        [BsonElement("imageURL")]
        public string ImageURL { get; set; }
        [BsonElement("tags")]
        public string[] Tags { get; set; }
        [BsonElement("price")]
        public int Price { get; set; }
    }

}
