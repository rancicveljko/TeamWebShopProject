using System.ComponentModel.DataAnnotations;

namespace WebShop.Models
{
    public class RegistrationModelAdmin
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

        public RegistrationModelAdmin() { }

        public RegistrationModelAdmin(Admin admin)
        {
            Ime = admin.Ime;
            Prezime = admin.Prezime;
            Adresa = admin.Adresa;
            BrojTelefona = admin.BrojTelefona;
            Email = admin.Email;
            Password = admin.Password;
        }

    }
}
