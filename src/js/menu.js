    // Datos quemados para el menú
    //localStorage.removeItem('menuItems');
    const menuItems = [
      // Entradas (2 elementos)
      {
        name: "Camarones al Ajillo",
        description: "Camarones salteados en aceite de oliva",
        price: "20.00",
        image: "https://www.recetasnestlecam.com/sites/default/files/srh_recipes/a3edc0910e9c2e3c8a7670600542088a.jpg",
        category: "entradas"
      },
      {
        name: "Carpacio de res",
        description: "Finas láminas de carne con rúcula y parmesano",
        price: "22.50",
        image: "https://vivirmejor.mx/vm-content/uploads/2023/08/Carpaccio-Res-2.jpg",
        category: "entradas"
      },
      
      // Platos Fuertes (2 elementos)
      {
        name: "Filete de res",
        description: "Corte premium con puré de papas y vegetales asados",
        price: "5.00",
        image: "https://cdn0.recetasgratis.net/es/posts/1/0/9/filete_a_la_tampiquena_20901_orig.jpg",
        category: "platos"
      },
      {
        name: "Salmon a la plancha",
        description: "Con risotto de espárragos y salsa de mantequilla",
        price: "22.50",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp6yNxM60F79TSNb7oM6ahsBNF6SZRDbKa-A&s",
        category: "platos"
      },
      
      // Postres (2 elementos)
      {
        name: "Cheesecake",
        description: "Cheesecake de Frutos Rojos",
        price: "8.50",
        image: "https://www.recetasnestle.com.ec/sites/default/files/srh_recipes/7f9ebeaceea909a80306da27f0495c59.jpg",
        category: "postres"
      },
      {
        name: "Flan",
        description: "Postre tradicional con caramelo casero",
        price: "7.00",
        image: "https://cdn-ilddihb.nitrocdn.com/MgqZCGPEMHvMRLsisMUCAIMWvgGMxqaj/assets/images/optimized/rev-51c0748/www.goya.com/wp-content/uploads/2023/10/flan.jpg",
        category: "postres"
      },
      
      // Bebidas (2 elementos)
      {
        name: "Vino Tinto Reserva",
        description: "Copa de vino tinto de nuestra selección premium",
        price: "12.50",
        image: "https://descorcha.com/mx/img/ybc_blog/post/1738074785758.jpg",
        category: "bebidas"
      },
      {
        name: "Limonada Natural",
        description: "Refrescante limonada con menta y hielo",
        price: "5.00",
        image: "https://comedera.com/wp-content/uploads/sites/9/2022/04/Limonada-shutterstock_379385302.jpg?w=4096",
        category: "bebidas"
      }
    ];
    // Guardar en localStorage si no existen datos
    if (!localStorage.getItem('menuItems')) {
      localStorage.setItem('menuItems', JSON.stringify(menuItems));
    }

    // Cargar datos desde localStorage
    const storedMenuItems = JSON.parse(localStorage.getItem('menuItems'));

    // Función para crear elementos del menú
    function createMenuItem(item) {
      const menuItemDiv = document.createElement('div');
      menuItemDiv.classList.add('col-lg-4', 'col-md-6', 'mb-4');
      menuItemDiv.innerHTML = `
        <div class="card menu-item-card h-100">
          <img src="${item.image}" alt="${item.name}" class="card-img-top" style="height: 200px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="menu-item-title">${item.name}</h5>
            <p class="menu-item-description flex-grow-1">${item.description}</p>
            <div class="menu-item-price mb-2">$${item.price}</div>
            <button class="btn btn-order add-to-cart" data-name="${item.name}" data-price="${item.price}">
              Agregar al carrito
            </button>
          </div>
        </div>
      `;
      return menuItemDiv;
    }

    // Función para cargar elementos por categoría
    function loadMenuItems() {
      // Limpiar contenedores
      document.getElementById('entradas-container').innerHTML = '';
      document.getElementById('platos-container').innerHTML = '';
      document.getElementById('postres-container').innerHTML = '';
      document.getElementById('bebidas-container').innerHTML = '';
      
      // Filtrar y cargar elementos por categoría
      const entradas = storedMenuItems.filter(item => item.category === 'entradas');
      const platos = storedMenuItems.filter(item => item.category === 'platos');
      const postres = storedMenuItems.filter(item => item.category === 'postres');
      const bebidas = storedMenuItems.filter(item => item.category === 'bebidas');
      
      // Cargar entradas
      entradas.forEach(item => {
        document.getElementById('entradas-container').appendChild(createMenuItem(item));
      });
      
      // Cargar platos fuertes
      platos.forEach(item => {
        document.getElementById('platos-container').appendChild(createMenuItem(item));
      });
      
      // Cargar postres
      postres.forEach(item => {
        document.getElementById('postres-container').appendChild(createMenuItem(item));
      });
      
      // Cargar bebidas
      bebidas.forEach(item => {
        document.getElementById('bebidas-container').appendChild(createMenuItem(item));
      });
      
      // Reconectar eventos del carrito
      reconnectCartEvents();
    }

    // Código del carrito
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Función para actualizar el conteo en la navbar
    function updateCartCount() {
      const cartCount = document.getElementById('cartCount');
      const count = cart.length;
      cartCount.textContent = count;
      cartCount.style.display = count > 0 ? 'block' : 'none';
    }

    // Función para actualizar el modal del carrito
    function updateCartModal() {
      const cartItems = document.getElementById('cartItems');
      const cartTotal = document.getElementById('cartTotal');
      const cartMessage = document.getElementById('cartMessage');
      const cartInvoice = document.getElementById('cartInvoice');
      const invoiceItems = document.getElementById('invoiceItems');
      const invoiceTotal = document.getElementById('invoiceTotal');
      const cartTotalContainer = document.getElementById('cartTotalContainer');
      const proceedPayment = document.getElementById('proceedPayment');

      cartItems.innerHTML = '';
      cartMessage.style.display = 'none';
      cartInvoice.style.display = 'none';
      cartTotalContainer.style.display = 'block';
      proceedPayment.style.display = 'block';

      let total = 0;
      cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        itemElement.innerHTML = `
          <div>
            <h6>${item.name}</h6>
            <small>${item.description}</small>
          </div>
          <div>
            <span>$${item.price}</span>
            <button class="btn btn-sm btn-danger ms-2 remove-item" data-index="${index}">Eliminar</button>
          </div>
        `;
        cartItems.appendChild(itemElement);
        total += parseFloat(item.price);
      });

      cartTotal.textContent = `$${total.toFixed(2)}`;

      // Evento para eliminar items
      document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function () {
          const index = this.dataset.index;
          cart.splice(index, 1);
          localStorage.setItem('cart', JSON.stringify(cart));
          updateCartModal();
          updateCartCount();
        });
      });
    }

    // Función para mostrar factura
    function showInvoice() {
      const cartItems = document.getElementById('cartItems');
      const cartTotal = document.getElementById('cartTotal');
      const cartMessage = document.getElementById('cartMessage');
      const cartInvoice = document.getElementById('cartInvoice');
      const invoiceItems = document.getElementById('invoiceItems');
      const invoiceTotal = document.getElementById('invoiceTotal');
      const cartTotalContainer = document.getElementById('cartTotalContainer');
      const proceedPayment = document.getElementById('proceedPayment');

      cartItems.innerHTML = '';
      cartMessage.style.display = 'block';
      cartInvoice.style.display = 'block';
      cartTotalContainer.style.display = 'none';
      proceedPayment.style.display = 'none';
      invoiceItems.innerHTML = '';

      let total = 0;
      cart.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.name}</td>
          <td>$${item.price}</td>
        `;
        invoiceItems.appendChild(row);
        total += parseFloat(item.price);
      });

      invoiceTotal.textContent = `$${total.toFixed(2)}`;

      // Guardar la orden pagada en localStorage inmediatamente
      if (cart.length > 0) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push({
          items: [...cart],
          estado: 'Pendiente',
          fecha: new Date().toLocaleString()
        });
        localStorage.setItem('orders', JSON.stringify(orders));
      }

      setTimeout(() => {
        cart = [];
        localStorage.removeItem('cart');
        updateCartCount();
      }, 3000);
    }

    // Función para reconectar eventos del carrito
    function reconnectCartEvents() {
      document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
          const name = this.dataset.name;
          const price = this.dataset.price;
          const description = this.parentElement.querySelector('.menu-item-description').textContent;

          cart.push({ name, price, description });
          localStorage.setItem('cart', JSON.stringify(cart));
          updateCartCount();

          const toastEl = document.getElementById('liveToast');
          const toastBody = document.getElementById('toastBody');

          toastEl.className = "toast align-items-center text-white bg-success border-0";
          toastBody.textContent = `✅ ${name} agregado al carrito!`;

          const toast = new bootstrap.Toast(toastEl, {
            delay: 1500
          });

          toast.show();
        });
      });
    }

    // Eventos del carrito
    document.getElementById('clearCart').addEventListener('click', function () {
      cart = [];
      localStorage.removeItem('cart');
      updateCartModal();
      updateCartCount();
    });

    // Evento para proceder al pago
    document.getElementById('proceedPayment').addEventListener('click', function () {
      if (cart.length === 0) {
        const toastEl = document.getElementById('liveToast');
        const toastBody = document.getElementById('toastBody');

        toastEl.className = "toast align-items-center text-dark bg-warning border-0";
        toastBody.textContent = `⚠️ Por favor seleccione al menos un elemento`;
        const toast = new bootstrap.Toast(toastEl, {
          delay: 1500
        });

        toast.show();
        return;
      }
      showInvoice();
    });

    // Inicializar
    document.addEventListener('DOMContentLoaded', function() {
      // Cargar elementos del menú
      loadMenuItems();
      
      // Actualizar carrito
      updateCartCount();
      
      // Evento para actualizar modal al abrirse
      const cartModal = document.getElementById('cartModal');
      cartModal.addEventListener('show.bs.modal', updateCartModal);
    });