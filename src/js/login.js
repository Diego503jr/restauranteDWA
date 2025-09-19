document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  //   Obtenemos los campos
  const logEmailIn = document.getElementById("logEmail");
  const logPasswordIn = document.getElementById("logPassword");

  const logEmail = logEmailIn.value.trim();
  const logPassword = logPasswordIn.value.trim();

  //   Limpiamos los campos
  logEmailIn.value = "";
  logPasswordIn.value = "";

  //   Validamos que no esten vacios
  if (!logEmail || !logPassword) {
    alert("Por favor, completa todos los campos");
    return;
  }

  //   Obtenemos los datos del localstorage
  const savedUser = JSON.parse(localStorage.getItem("user"));

  //   Validamos que haya un registro
  if (!savedUser) {
    alert("No hay usuarios registrados");
    return;
  }

  //   Por ultimo validamos si concuerdan los datos
  if (logEmail === savedUser.email && logPassword === savedUser.password) {
    alert("Inicio de sesión exitoso ✅");
    localStorage.setItem("isLoggedIn", "true");

    window.location.href = "./src/home.html";
  } else {
    alert("Credenciales incorrectas ❌");
  }
});
