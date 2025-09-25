document.addEventListener("DOMContentLoaded", function () {
  // ---- Cargar Header y Footer ----
  // Función para cargar contenido desde el archivo HTML
  function loadHTML(elementId, filePath) {
    fetch(filePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        document.getElementById(elementId).innerHTML = data;

        //resalta el link activo en el header solo si es el header
        if (elementId === "header") {
          const currentPath = window.location.pathname.split("/").pop();
          const navLinks = document.querySelectorAll("#navbarNav .nav-link");
          navLinks.forEach((link) => {
            // Aseguramos que la ruta del link no sea vacía
            const linkPath = link.getAttribute("href").split("/").pop();
            if (linkPath === currentPath) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }
          });
        }

        const logoutBtn = document.getElementById("btn-logout");
        if (logoutBtn) {
          const toastEl = document.getElementById("logoutToast");
          const toastBody = document.getElementById("toastBody");
          const toast = new bootstrap.Toast(toastEl);

          logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            //   Obtenemos los datos del localstorage
            const savedUser = JSON.parse(localStorage.getItem("user"));
            const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));

            if (savedUser && isLoggedIn) {
              toastEl.className =
                "toast align-items-center text-white bg-success border-0";
              toastBody.textContent = "✅ Éxito, Cerrar Sesion";
              toast.show();

              // Actualizamos el log
              localStorage.setItem("isLoggedIn", "false");

              setTimeout(() => {
                window.location.href = "./../../index.html";
              }, 2000);
            }
          });
        }
      })
      .catch((error) =>
        console.error(
          `Error al cargar el archivo HTML para ${elementId}:`,
          error
        )
      );
  }

  // ---- Navbar con scroll ----
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        navbar.style.backgroundColor = "rgba(27, 58, 75, 0.95)";
      } else {
        navbar.style.backgroundColor = "transparent";
      }
    });
  }

  // Cargar el header, footer y toast con las rutas correctas
  loadHTML("header", "header.html");
  loadHTML("footer", "footer.html");
  loadHTML("toast-logout", "toast.html");

// ---- Testimonios ----
  const formTestimonio = document.getElementById("formTestimonio");
  const carruselTestimonios = document.querySelector("#carruselTestimonios .carousel-inner");
  const modalTestimonios = document.getElementById("modalTestimonios");
  const modalBootstrap = new bootstrap.Modal(modalTestimonios);

  // Función para obtener testimonios del localStorage o un array por defecto
  function getTestimonios() {
    let testimonios = localStorage.getItem("testimonials");
    if (testimonios) {
      return JSON.parse(testimonios);
    } else {
      const defaultTestimonios = [
        { name: "Teresa Gutierrez", role: "Empresaria", message: "Cada visita es única. La atención es impecable y los cortes de carne son perfectos." },
        { name: "Maggie López", role: "Fotógrafa", message: "Me sorprendió la armonía de sabores. Ambiente elegante pero cálido." },
        { name: "Alejandro Ramírez", role: "Abogado", message: "La combinación de mariscos y carnes es espectacular. Todo cuidado al máximo." },
        { name: "Claudia Mendez", role: "Arquitecta", message: "El Filete Mignon fue el mejor que he probado. Ingredientes de primera calidad." },
        { name: "Daniel Herrera", role: "Ejecutivo de Negocios", message: "El lugar perfecto para cenas de trabajo. Elegancia y gastronomía de primer nivel." },
        { name: "Isabella Torres", role: "Chef Aficionada", message: "La Pasta Alfredo y el Salmón a la Parrilla me dejaron sin palabras. Pasión en cada bocado." }
      ];
      localStorage.setItem("testimonials", JSON.stringify(defaultTestimonios));
      return defaultTestimonios;
    }
  }

  // Renderizar los testimonios en el carrusel
  function renderTestimonios() {
    const testimonios = getTestimonios();
    carruselTestimonios.innerHTML = "";

    for (let i = 0; i < testimonios.length; i += 3) {
      const carouselItem = document.createElement("div");
      carouselItem.classList.add("carousel-item");
      if (i === 0) {
        carouselItem.classList.add("active");
      }

      const row = document.createElement("div");
      row.classList.add("row", "g-4");

      const group = testimonios.slice(i, i + 3);
      group.forEach(testimonio => {
        const col = document.createElement("div");
        col.classList.add("col-md-4");
        col.innerHTML = `
          <div class="card h-100 shadow-sm">
            <div class="card-body text-center">
              <h5 class="card-title">${testimonio.name}</h5>
              <h6 class="text-muted">${testimonio.role || 'Cliente'}</h6>
              <p>"${testimonio.message}"</p>
            </div>
          </div>
        `;
        row.appendChild(col);
      });

      carouselItem.appendChild(row);
      carruselTestimonios.appendChild(carouselItem);
    }
  }

  // Maneja el envío del formulario
  if (formTestimonio) {
    formTestimonio.addEventListener("submit", function (event) {
      event.preventDefault();

      const nombre = document.getElementById("nombre").value.trim();
      const mensaje = document.getElementById("mensaje").value.trim();
      const profesion = document.getElementById("profesion").value.trim();

      // Recuperar testimonios existentes
      let testimonios = getTestimonios();

      // Crear el nuevo testimonio
      const nuevoTestimonio = {
        name: nombre,
        role: profesion || "Cliente",
        message: mensaje
      };

      // Guardar en el array y actualizar localStorage
      testimonios.push(nuevoTestimonio);
      localStorage.setItem("testimonials", JSON.stringify(testimonios));

      // Volver a renderizar
      renderTestimonios();

      // Mostrar toast
      const toastEl = document.getElementById('logoutToast'); 
      const toastBody = document.getElementById('toastBody'); 
      toastEl.className = "toast align-items-center text-white bg-success border-0";
      toastBody.textContent = `¡Gracias por tu testimonio! Se ha agregado correctamente.`;
      const toast = new bootstrap.Toast(toastEl);
      toast.show();

      // Cerrar modal y resetear formulario
      modalBootstrap.hide();
      formTestimonio.reset();
    });
  }
  renderTestimonios();
});
