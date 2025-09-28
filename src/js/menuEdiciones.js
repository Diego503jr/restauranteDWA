let menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];

function populateItemList(filterText = '') {
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = '';

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
            e.stopPropagation();
            populateForm(item, originalIndex);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-sm', 'btn-danger', 'delete-btn');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
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

function populateForm(item, index) {
    document.getElementById('itemIndex').value = index;
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemDescription').value = item.description;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemImage').value = item.image || '';
    document.getElementById('itemCategory').value = item.category;

    document.getElementById('formTitle').textContent = 'Editar Elemento';
    document.getElementById('submitButton').textContent = 'Actualizar';
    document.getElementById('cancelEdit').style.display = 'inline-block';

    document.querySelectorAll('#itemList .list-group-item').forEach(li => {
        li.classList.remove('active');
    });
    const selectedItem = document.querySelector(`#itemList .list-group-item[data-index="${index}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
    }

    updatePreview(item);
}

function clearForm() {
    document.getElementById('itemForm').reset();
    document.getElementById('itemIndex').value = '-1';
    document.getElementById('formTitle').textContent = 'Agregar Nuevo Elemento';
    document.getElementById('submitButton').textContent = 'Agregar';
    document.getElementById('cancelEdit').style.display = 'none';

    document.querySelectorAll('#itemList .list-group-item').forEach(li => {
        li.classList.remove('active');
    });

    document.getElementById('previewContainer').innerHTML =
        '<p class="text-muted">Selecciona un elemento o crea uno nuevo para ver la vista previa</p>';
}

function cancelEdit() {
    clearForm();
}

function deleteItem(index) {
    if (confirm(`¿Estás seguro de que deseas eliminar "${menuItems[index].name}"?`)) {
        menuItems.splice(index, 1);
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
        populateItemList(document.getElementById('searchInput').value);
        clearForm();

        showToast(`Elemento eliminado correctamente`, 'success');
    }
}

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
        menuItems[index] = newItem;
        showToast(`✅ ${newItem.name} actualizado correctamente!`, 'success');
        clearForm();

    } else {
        menuItems.push(newItem);
        showToast(`✅ ${newItem.name} agregado correctamente!`, 'success');
        clearForm();
    }
    populateItemList();
    localStorage.setItem('menuItems', JSON.stringify(menuItems));

}

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

  
}

function showToast(message, type = 'success') {
    const toastElement = document.getElementById('toast-logout');
    const toast = new bootstrap.Toast(toastElement);

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

document.addEventListener('DOMContentLoaded', () => {
    populateItemList();

    document.getElementById('itemForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('clearForm').addEventListener('click', clearForm);
    document.getElementById('cancelEdit').addEventListener('click', cancelEdit);

    document.getElementById('itemName').addEventListener('input', updatePreviewFromForm);
    document.getElementById('itemDescription').addEventListener('input', updatePreviewFromForm);
    document.getElementById('itemPrice').addEventListener('input', updatePreviewFromForm);
    document.getElementById('itemImage').addEventListener('input', updatePreviewFromForm);
    document.getElementById('itemCategory').addEventListener('change', updatePreviewFromForm);

    document.getElementById('searchInput').addEventListener('input', function () {
        populateItemList(this.value);
    });
});

function updatePreviewFromForm() {
    const name = document.getElementById('itemName').value;
    const description = document.getElementById('itemDescription').value;
    const price = document.getElementById('itemPrice').value;
    const image = document.getElementById('itemImage').value;
    const category = document.getElementById('itemCategory').value;

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
