//   Funcion para validar email
function emailValidation(email) {
  const regx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regx.test(email);
}

// Funcion para validar si concuerdan las pass
function passTopass(pass, confPass) {
  return pass === confPass;
}

// Funcion para validar password
function passValidation(pass) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(pass);
}

document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    //   Obtenemos los campos
    const nameIn = document.getElementById("name");
    const emailIn = document.getElementById("email");
    const passwordIn = document.getElementById("password");
    const confirmPasswordIn = document.getElementById("confirmPassword");

    const name = nameIn.value.trim();
    const email = emailIn.value.trim();
    const password = passwordIn.value.trim();
    const confirmPassword = confirmPasswordIn.value.trim();

    //   Limpiamos los campos
    nameIn.value = "";
    emailIn.value = "";
    passwordIn.value = "";
    confirmPasswordIn.value = "";

    //   Validamos que no esten vacios
    if (!name || !email || !password || !confirmPassword) {
      alert("Por favor, completa todos los campos ❌");
      return;
    }

    if (!emailValidation(email)) {
      alert("Email invalido ❌");
      return;
    }

    if (!passValidation(password)) {
      alert(
        "La contraseña debe contener una minuscula, mayuscula, un numero y minimo 8 caracteres ❌"
      );
      return;
    }

    if (!passTopass(password, confirmPassword)) {
      alert("Contraseñas no concuerdan ❌");
      return;
    }

    const user = { name, email, password };
    localStorage.setItem("user", JSON.stringify(user));

    alert("Registro exitoso ✅");
    window.location.href = "./index.html"; // redirigir al login
  });
