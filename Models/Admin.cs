using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WebShop.Models
{
    [BsonIgnoreExtraElements]

    public class Admin
    {
        [BsonId]
        public ObjectId Id { get; set; }
        [BsonElement("Ime")]
        public string Ime { get; set; }
        [BsonElement("Prezime")]
        public string Prezime { get; set; }
        [BsonElement("Adresa")]
        public string Adresa { get; set; }
        [BsonElement("Email")]
        public string Email { get; set; }
        public string Password { get; set; }
        public string PasswordSalt { get; set; }
        
        [BsonElement("BrojTelefona")]
        public string BrojTelefona { get; set; }
        [BsonElement("Role")]
        public UserRole Role { get; set; }
       
    }
}