const toastEl = document.getElementById("loginToast");
const toastBody = document.getElementById("toastBody");
const toast = new bootstrap.Toast(toastEl);

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  //   Obtenemos los campos
  const logEmailIn = document.getElementById("logEmail");
  const logPasswordIn = document.getElementById("logPassword");

  const logEmail = logEmailIn.value.trim();
  const logPassword = logPasswordIn.value.trim();

  //   Validamos que no esten vacios
  if (!logEmail || !logPassword) {
    toastEl.className =
      "toast align-items-center text-dark bg-warning border-0";
    toastBody.textContent = "⚠️ Atención, Todos los campos son obligatorios";
    toast.show();
    return;
  }

  //   Obtenemos los datos del localstorage
  const savedUser = JSON.parse(localStorage.getItem("user"));

  //   Validamos que haya un registro
  if (!savedUser) {
    toastEl.className =
      "toast align-items-center text-dark bg-warning border-0";
    toastBody.textContent = "⚠️ Atención, No hay usuarios registrados";
    toast.show();
    return;
  }

  //   Por ultimo validamos si concuerdan los datos
  if (logEmail === savedUser.email && logPassword === savedUser.password) {
    toastEl.className =
      "toast align-items-center text-white bg-success border-0";
    toastBody.textContent = "✅ Éxito, Inicio de sesión";
    toast.show();
    localStorage.setItem("isLoggedIn", "true");

    setTimeout(() => {
      window.location.href = "./src/home.html";

      //   Limpiamos los campos
      logEmailIn.value = "";
      logPasswordIn.value = "";
    }, 2000);
  } else {
    toastEl.className =
      "toast align-items-center text-white bg-danger border-0";
    toastBody.textContent = "❌ Error, Credenciales incorrectas";
    toast.show();
    return;
  }
});
