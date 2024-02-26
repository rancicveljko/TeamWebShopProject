using WebShop.Models;
using MongoDB.Bson;

namespace WebShop.Services
{
    public interface IAdminService
    {
        Task<Admin> GetAdminByEmailAsync(string email);
        Task<bool> Register(RegistrationModelAdmin resource);
    }
}