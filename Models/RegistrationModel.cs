using System.ComponentModel.DataAnnotations;

namespace WebShop.Services
{

    public class RegistrationModel
    {
        [Required]
        public string Ime { get; set; }
        [Required]
        public string Prezime { get; set; }
        [Required]
        public string Adresa { get; set; }
        [Required]
        public string BrojTelefona { get; set; }
        [Required, EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
