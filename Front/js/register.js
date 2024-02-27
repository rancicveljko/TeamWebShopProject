document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registrationForm");

    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const firstName = document.getElementById("firstName").value;
      const lastName = document.getElementById("lastName").value;
      const address = document.getElementById("address").value;
      const phoneNumber = document.getElementById("phoneNumber").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      const data = {
        ime: firstName,
        prezime: lastName,
        adresa: address,
        brojTelefona: phoneNumber,
        email: email,
        password: password,
      };
  
      fetch("http://localhost:5135/Korisnik/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            alert("User registration failed. Please try again!");
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((result) => {
          alert("Successful user registration!");
          window.location.href = "../html/index.html";
        })
        .catch((error) => {
          console.error("Error:", error);
        });      
    });
});
