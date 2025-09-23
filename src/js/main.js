document.addEventListener("DOMContentLoaded", function() {

  // ---- Cargar Header y Footer ----
  // Función para cargar contenido desde el archivo HTML
  function loadHTML(elementId, filePath) {
    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        document.getElementById(elementId).innerHTML = data;

        //resalta el link activo en el header solo si es el header
        if (elementId === "header") {
          const currentPath = window.location.pathname.split('/').pop();
          const navLinks = document.querySelectorAll('#navbarNav .nav-link');
          navLinks.forEach(link => {
            // Aseguramos que la ruta del link no sea vacía
            const linkPath = link.getAttribute('href').split('/').pop();
            if (linkPath === currentPath) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      })
      .catch(error => console.error(`Error al cargar el archivo HTML para ${elementId}:`, error));
  }
  
  // ---- Navbar con scroll ----
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", function() {
      if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(27, 58, 75, 0.95)';
      } else {
        navbar.style.backgroundColor = 'transparent';
      }
    });
  }

  // Cargar el header y footer con las rutas correctas
  loadHTML("header", "header.html");
  loadHTML("footer", "footer.html");
});