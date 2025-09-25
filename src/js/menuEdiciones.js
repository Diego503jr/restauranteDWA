// Recuperamos de localStorage
let menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];

// Function to populate the item list with optional filtering
function populateItemList(filterText = '') {
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = ''; // Clear existing items

    // Filter items based on search text
    const filteredItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(filterText.toLowerCase()) ||
        item.description.toLowerCase().includes(filterText.toLowerCase()) ||
        item.category.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filteredItems.length === 0) {
        const noResultsItem = document.createElement('li');
        noResultsItem.classList.add('list-group-item', 'text-center', 'text-muted');
        noResultsItem.textContent = 'No se encontraron elementos';
        itemList.appendChild(noResultsItem);
        return;
    }

    filteredItems.forEach((item, index) => {
        const originalIndex = menuItems.indexOf(item);
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'list-group-item-action', 'd-flex', 'justify-content-between', 'align-items-center');
        listItem.dataset.index = originalIndex;

        const itemText = document.createElement('span');
        itemText.textContent = item.name;

        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('d-flex', 'gap-2');


        const editButton = document.createElement('button');
        editButton.classList.add('btn', 'btn-sm', 'btn-warning', 'edit-btn');
        editButton.textContent = 'Editar';
        editButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering the list item click
            populateForm(item, originalIndex);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-sm', 'btn-danger', 'delete-btn');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering the list item click
            deleteItem(originalIndex);
        });

        buttonsContainer.appendChild(editButton);
        buttonsContainer.appendChild(deleteButton);

        listItem.appendChild(itemText);
        listItem.appendChild(buttonsContainer);

        listItem.addEventListener('click', () => populateForm(item, originalIndex));
        itemList.appendChild(listItem);
    });
}

// Function to populate the form with selected item data
function populateForm(item, index) {
    document.getElementById('itemIndex').value = index;
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemDescription').value = item.description;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemImage').value = item.image || '';
    document.getElementById('itemCategory').value = item.category;

    // Change form to edit mode
    document.getElementById('formTitle').textContent = 'Editar Elemento';
    document.getElementById('submitButton').textContent = 'Actualizar';
    document.getElementById('cancelEdit').style.display = 'inline-block';

    // Highlight the selected item in the list
    document.querySelectorAll('#itemList .list-group-item').forEach(li => {
        li.classList.remove('active');
    });
    const selectedItem = document.querySelector(`#itemList .list-group-item[data-index="${index}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
    }

    // Update preview
    updatePreview(item);
}

// Function to clear the form
function clearForm() {
    document.getElementById('itemForm').reset();
    document.getElementById('itemIndex').value = '-1';
    document.getElementById('formTitle').textContent = 'Agregar Nuevo Elemento';
    document.getElementById('submitButton').textContent = 'Agregar';
    document.getElementById('cancelEdit').style.display = 'none';

    // Remove active class from list items
    document.querySelectorAll('#itemList .list-group-item').forEach(li => {
        li.classList.remove('active');
    });

    // Clear preview
    document.getElementById('previewContainer').innerHTML =
        '<p class="text-muted">Selecciona un elemento o crea uno nuevo para ver la vista previa</p>';
}

// Function to cancel edit mode
function cancelEdit() {
    clearForm();
}

// Function to delete an item
function deleteItem(index) {
    if (confirm(`¿Estás seguro de que deseas eliminar "${menuItems[index].name}"?`)) {
        menuItems.splice(index, 1);
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
        populateItemList(document.getElementById('searchInput').value);
        clearForm();

        // Show success message
        showToast(`Elemento eliminado correctamente`, 'success');
    }
}

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault();

    const index = parseInt(document.getElementById('itemIndex').value);
    const newItem = {
        name: document.getElementById('itemName').value,
        description: document.getElementById('itemDescription').value,
        price: document.getElementById('itemPrice').value,
        image: document.getElementById('itemImage').value || "https://via.placeholder.com/300x200?text=Imagen",
        category: document.getElementById('itemCategory').value
    };

    if (index >= 0) {
        // Editing existing item
        menuItems[index] = newItem;
        showToast(`✅ ${newItem.name} actualizado correctamente!`, 'success');
        clearForm();

    } else {
        // Adding new item
        menuItems.push(newItem);
        showToast(`✅ ${newItem.name} agregado correctamente!`, 'success');
        clearForm();
    }

    // Save to localStorage
    localStorage.setItem('menuItems', JSON.stringify(menuItems));

    // // Refresh the list with current search filter
    // populateItemList(document.getElementById('searchInput').value);
    // updatePreview(newItem);
    // clearForm();
}

// Function to create menu item preview
function createMenuItemPreview(name, description, price, imageUrl = "https://via.placeholder.com/300x200?text=Imagen", category) {
    const menuItemDiv = document.createElement('div');
    menuItemDiv.classList.add('preview-item');
    menuItemDiv.innerHTML = `
                <div class="card menu-item-card h-100">
                    <img src="${imageUrl}" alt="${name}" class="card-img-top" style="height: 200px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="menu-item-title">${name}</h5>
                        <p class="menu-item-description flex-grow-1">${description}</p>
                        <div class="menu-item-price mb-2">$${price}</div>
                        <button class="btn btn-order" data-name="${name}" data-price="${price}">
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            `;
    return menuItemDiv;
}

// Function to update the preview
function updatePreview(item) {
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = '';

    const menuItemDiv = createMenuItemPreview(
        item.name,
        item.description,
        item.price,
        item.image || "https://via.placeholder.com/300x200?text=Imagen",
        item.category
    );
    previewContainer.appendChild(menuItemDiv);

    // Add event listener to the add-to-cart button
    const addToCartButton = menuItemDiv.querySelector('.add-to-cart');
    addToCartButton.addEventListener('click', function () {
        const name = this.dataset.name;
        const price = this.dataset.price;
        const description = this.parentElement.querySelector('.menu-item-description').textContent;
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push({ name, price, description });
        localStorage.setItem('cart', JSON.stringify(cart));
        showToast(`✅ ${name} agregado al carrito!`, 'success');
    });
}

// Function to show toast messages
function showToast(message, type = 'success') {
    const toastElement = document.getElementById('toast-logout');
    const toast = new bootstrap.Toast(toastElement);

    // Set toast class based on type
    if (type === 'success') {
        toastElement.className = "toast align-items-center text-white bg-success border-0";
    } else if (type === 'error') {
        toastElement.className = "toast align-items-center text-white bg-danger border-0";
    }

    toastElement.innerHTML = `
                <div class="d-flex">
                    <div class="toast-body">${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>`;
    toast.show();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateItemList();

    document.getElementById('itemForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('clearForm').addEventListener('click', clearForm);
    document.getElementById('cancelEdit').addEventListener('click', cancelEdit);

    // Add real-time preview updates
    document.getElementById('itemName').addEventListener('input', updatePreviewFromForm);
    document.getElementById('itemDescription').addEventListener('input', updatePreviewFromForm);
    document.getElementById('itemPrice').addEventListener('input', updatePreviewFromForm);
    document.getElementById('itemImage').addEventListener('input', updatePreviewFromForm);
    document.getElementById('itemCategory').addEventListener('change', updatePreviewFromForm);

    // Add search functionality
    document.getElementById('searchInput').addEventListener('input', function () {
        populateItemList(this.value);
    });
});

// Function to update preview based on form inputs
function updatePreviewFromForm() {
    const name = document.getElementById('itemName').value;
    const description = document.getElementById('itemDescription').value;
    const price = document.getElementById('itemPrice').value;
    const image = document.getElementById('itemImage').value;
    const category = document.getElementById('itemCategory').value;

    // solo actualizar vista previa al ingresar un nombre
    if (name.trim() !== '') {
        const previewItem = {
            name: name || "Nuevo Elemento",
            description: description || "Descripción del elemento",
            price: price || "0.00",
            image: image || "https://via.placeholder.com/300x200?text=Imagen",
            category: category || "platos"
        };
        updatePreview(previewItem);
    } else {
        document.getElementById('previewContainer').innerHTML =
            '<p class="text-muted">Selecciona un elemento o crea uno nuevo para ver la vista previa</p>';
    }
}
