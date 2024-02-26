using WebShop.Models;
using MongoDB.Bson;

namespace WebShop.Services
{
    public interface IKorisnikService
    {

        Task<Korisnik> GetKorisnikByEmailAsync(string email);
        Task<bool> Register(RegistrationModel resource);
    }
}