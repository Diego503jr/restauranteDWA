const toastEl = document.getElementById("logoutToast");
const toastBody = document.getElementById("toastBody");
const toast = new bootstrap.Toast(toastEl);

function logout() {
  //   Obtenemos los datos del localstorage
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));

  if (savedUser && isLoggedIn) {
    toastEl.className =
      "toast align-items-center text-white bg-success border-0";
    toastBody.textContent = "✅ Éxito, Cerrar Sesion";
    toast.show();

    // Eliminamos el usuario y el log
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    setTimeout(() => {
      window.location.href = "../../index.html";
    }, 3000);
  }
}
