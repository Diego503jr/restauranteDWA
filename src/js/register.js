const toastEl = document.getElementById("registerToast");
const toastBody = document.getElementById("toastBody");
const toast = new bootstrap.Toast(toastEl);

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
      toastEl.className =
        "toast align-items-center text-dark bg-warning border-0";
      toastBody.textContent =
        "⚠️ Atención, Por favor completa todos los campos";
      toast.show();
      return;
    }

    if (!emailValidation(email)) {
      toastEl.className =
        "toast align-items-center text-dark bg-warning border-0";
      toastBody.textContent = "⚠️ Atención, Email invalido";
      toast.show();
      return;
    }

    if (!passValidation(password)) {
      toastEl.className =
        "toast align-items-center text-dark bg-warning border-0";
      toastBody.textContent =
        "⚠️ Atención, La contraseña debe contener una minuscula, mayuscula, un numero y minimo 8 caracteres";
      toast.show();
      return;
    }

    if (!passTopass(password, confirmPassword)) {
      toastEl.className =
        "toast align-items-center text-dark bg-warning border-0";
      toastBody.textContent = "⚠️ Atención, Contraseñas no concuerdan";
      toast.show();
      return;
    }

    const user = { name, email, password };
    localStorage.setItem("user", JSON.stringify(user));

    toastEl.className =
      "toast align-items-center text-white bg-success border-0";
    toastBody.textContent = "✅ Éxito, Registro";
    toast.show();

    setTimeout(() => {
      window.location.href = "./index.html"; // redirigir al login
    }, 3000);
  });
