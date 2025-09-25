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


// Evento para agregar al carrito
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

        toastEl.className = "toast align-items-center text-white bg-success border-0"; // Fondo verde
        toastBody.textContent = `✅ ${name} agregado al carrito!`;

        const toast = new bootstrap.Toast(toastEl, {
            delay: 1500 // 3 segundos
        });

        toast.show();

    });
});


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

        toastEl.className = "toast align-items-center text-dark bg-warning border-0"; // Fondo verde
        toastBody.textContent = `⚠️ Por favor seleccione al menos un elemento`;
        const toast = new bootstrap.Toast(toastEl, {
            delay: 1500 // 3 segundos
        });

        toast.show();
        return;
    }
    showInvoice();
});

// Actualizar al cargar la página
updateCartCount();

// Evento para actualizar modal al abrirse
const cartModal = document.getElementById('cartModal');
cartModal.addEventListener('show.bs.modal', updateCartModal);
