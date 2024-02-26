using MongoDB.Driver;
using WebShop.Models;
using MongoDB.Bson;
using Microsoft.Extensions.Options;

namespace WebShop.Services
{
    public class KorisnikService : IKorisnikService
    {
        private readonly IMongoDatabase _database;
        private readonly MongoDbSettings _settings;
        private readonly IMongoCollection<Korisnik> _korisnici;
        private readonly string _pepper;
        private readonly int _iteration;



        public KorisnikService(IOptions<MongoDbSettings> options, IConfiguration config)
        {
            _settings = options.Value;
            var client = new MongoClient(_settings.ConnectionString);
            _database = client.GetDatabase(_settings.DatabaseName);

            _korisnici = _database.GetCollection<Korisnik>("users");
            _pepper = config["PasswordHasher:Pepper"];
            _iteration = config.GetValue<int>("PasswordHasher:Iteration");
        }


        public async Task<Korisnik> GetKorisnikByEmailAsync(string email)
        {
            return await _korisnici.Find(korisnik => korisnik.Email == email).FirstOrDefaultAsync();
        }

        public async Task<bool> Register(RegistrationModel resource)
        {
            var korisnik = new Korisnik
            {
                Ime = resource.Ime,
                Prezime = resource.Prezime,
                Adresa = resource.Adresa,
                BrojTelefona = resource.BrojTelefona,
                Role = UserRole.Korisnik,
                Email = resource.Email,
                PasswordSalt = PasswordHasher.GenerateSalt(),
            };
            korisnik.Password = PasswordHasher.ComputeHash(resource.Password, korisnik.PasswordSalt, _pepper, _iteration);
            _korisnici.InsertOne(korisnik);

            return true;
        }
    }
}