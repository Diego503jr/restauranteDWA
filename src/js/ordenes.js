document.addEventListener('DOMContentLoaded', () => {
    const ordersContainer = document.getElementById('ordersContainer');
    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    function renderOrders() {
        if (orders.length === 0) {
            ordersContainer.innerHTML = '<div class="alert alert-info">No hay órdenes para despachar.</div>';
            return;
        }
        let html = '';
        orders.forEach((order, idx) => {
            let total = order.items.reduce((sum, item) => sum + parseFloat(item.price), 0);
            html += `
                <div class="card mb-4">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span><strong>Orden #${idx + 1}</strong> | <small>${order.fecha}</small></span>
                        <span>
                            <span class="badge ${
                                order.estado === 'Pendiente' ? 'bg-warning text-dark' :
                                order.estado === 'Cocinando' ? 'bg-primary' :
                                'bg-success'
                            }">${order.estado}</span>
                            <button class="btn btn-sm btn-outline-danger ms-2" data-action="eliminar" data-idx="${idx}" title="Eliminar orden">
                                <i class="bi bi-trash"></i> Eliminar
                            </button>
                        </span>
                    </div>
                    <div class="card-body">
                        <ul class="list-group mb-3">
                            ${order.items.map(item => `
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>${item.name}</strong>
                                        <div class="small text-muted">${item.description}</div>
                                    </div>
                                    <span>$${parseFloat(item.price).toFixed(2)}</span>
                                </li>
                            `).join('')}
                        </ul>
                        <div class="text-end fw-bold mb-2">Total: $${total.toFixed(2)}</div>
                        <div>
                            ${order.estado === 'Pendiente' ? `
                                <button class="btn btn-sm btn-primary me-2" data-action="cocinar" data-idx="${idx}">Marcar como Cocinando</button>
                            ` : ''}
                            ${order.estado === 'Cocinando' ? `
                                <button class="btn btn-sm btn-success" data-action="entregar" data-idx="${idx}">Marcar como Entregado</button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
        ordersContainer.innerHTML = html;

        // Eventos para cambiar estado
        document.querySelectorAll('[data-action="cocinar"]').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = this.dataset.idx;
                orders[idx].estado = 'Cocinando';
                localStorage.setItem('orders', JSON.stringify(orders));
                renderOrders();
            });
        });
        document.querySelectorAll('[data-action="entregar"]').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = this.dataset.idx;
                orders[idx].estado = 'Entregado';
                localStorage.setItem('orders', JSON.stringify(orders));
                renderOrders();
            });
        });
        // Evento para eliminar orden
        document.querySelectorAll('[data-action="eliminar"]').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = this.dataset.idx;
                orders.splice(idx, 1);
                localStorage.setItem('orders', JSON.stringify(orders));
                renderOrders();
            });
        });
    }

    renderOrders();
});