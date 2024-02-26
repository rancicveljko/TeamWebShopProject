using MongoDB.Driver;
using WebShop.Models;
using MongoDB.Bson;
using Microsoft.Extensions.Options;

namespace WebShop.Services
{
    public class AdminSeederService : IHostedService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IConfiguration _configuration;
        private readonly IMongoCollection<Admin> _admin;

        private readonly IMongoDatabase _database;
        private readonly MongoDbSettings _settings;
        private readonly string _pepper;
        private readonly int _iteration;

        public AdminSeederService(IServiceProvider serviceProvider, IOptions<MongoDbSettings> options, IConfiguration configuration)
        {
            _serviceProvider = serviceProvider;
            _configuration = configuration;
            _settings = options.Value;
            var client = new MongoClient(_settings.ConnectionString);
            _database = client.GetDatabase(_settings.DatabaseName);
            _admin = _database.GetCollection<Admin>("admin");

            _pepper = configuration["PasswordHasher:Pepper"];
            _iteration = configuration.GetValue<int>("PasswordHasher:Iteration");
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var adminService = scope.ServiceProvider.GetRequiredService<IAdminService>();
                var passwordHasher = scope.ServiceProvider.GetRequiredService<PasswordHasher>();

                var existingAdmin = await adminService.GetAdminByEmailAsync("admin@example.com");

                if (existingAdmin == null)
                {
                    var adminData = new Admin
                    {
                        Ime = "Admin",
                        Prezime = "User",
                        Adresa = "Admin Address",
                        BrojTelefona = "123456789",
                        Role = UserRole.Admin,
                        Email = "admin@example.com",
                        PasswordSalt = PasswordHasher.GenerateSalt(),
                        Password = "adminpassword"
                    };

                    adminData.Password = PasswordHasher.ComputeHash(adminData.Password, adminData.PasswordSalt, _pepper, _iteration);

                    _admin.InsertOne(adminData);
                }
            }
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}
