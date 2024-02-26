document.addEventListener("DOMContentLoaded", function () {

    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const role = document.getElementById("role").value;
      localStorage.setItem("userRole", role);
      localStorage.setItem("email", email);
      const requestBody = {
        email: email,
        password: password,
      };
      if (role == "admin") {
        fetch("http://localhost:5135/api/AuthAdmin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })
          .then((response) => {
            if (!response.ok) {
              alert("Login failed. Try again!");
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            console.log("Token:", data.token);
            token = data.token;
            localStorage.setItem("token", token);
            alert("Successful login!");
            window.location.href = "../html/index.html";
          })
          .catch((error) => {
            console.error("Fetch error:", error);
          });
      } else {
        {
          fetch("http://localhost:5135/api/Auth", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          })
            .then((response) => {
              if (!response.ok) {
                alert("Login failed. Try again!");
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              console.log(data);
              token = data.token;
              localStorage.setItem("token", token);
              alert("Successful login!");
              window.location.href = "../html/index.html";
            })
            .catch((error) => {
              console.error("Fetch error:", error);
            });
        }
      }

    });
  
});
  