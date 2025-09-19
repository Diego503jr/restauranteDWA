// Validar sesión
if (localStorage.getItem("isLoggedIn") !== "true") {
  // No está logueado, redirigir al login
  alert("⚠️ Atención, No estas logueado, por favor registrate o inicia sesion");

  window.location.href = "../index.html";
}
