using MongoDB.Driver;
using WebShop.Models;
using MongoDB.Bson;
using Microsoft.Extensions.Options;

namespace WebShop.Services
{
    public class AdminService : IAdminService
    {
        private readonly IMongoCollection<Admin> _admin;

        private readonly IMongoDatabase _database;
        private readonly MongoDbSettings _settings;

        private readonly string _pepper;
        private readonly int _iteration;

        public AdminService(IOptions<MongoDbSettings> options, IConfiguration config)
        {
            _settings = options.Value;
            var client = new MongoClient(_settings.ConnectionString);
            _database = client.GetDatabase(_settings.DatabaseName);

            _admin = _database.GetCollection<Admin>("admin");
            _pepper = config["PasswordHasher:Pepper"];
            _iteration = config.GetValue<int>("PasswordHasher:Iteration");

        }
        public async Task<Admin> GetAdminByEmailAsync(string email)
        {
            return await _admin.Find(admin => admin.Email == email).FirstOrDefaultAsync();
        }

        public async Task<bool> Register(RegistrationModelAdmin resource)
        {
            var admin = new Admin
            {
                Ime = resource.Ime,
                Prezime = resource.Prezime,
                Adresa = resource.Adresa,
                BrojTelefona = resource.BrojTelefona,
                Role = UserRole.Admin,
                Email = resource.Email,
                PasswordSalt = PasswordHasher.GenerateSalt(),
            };
            admin.Password = PasswordHasher.ComputeHash(resource.Password, admin.PasswordSalt, _pepper, _iteration);
            _admin.InsertOne(admin);

            return true;
        }
    }
}