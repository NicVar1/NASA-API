// js/views/nasaView.js
const mainGallery = document.getElementById('mainGallery');
const galleryTitle = document.getElementById('galleryTitle');
const searchGallery = document.getElementById('searchGallery');
const searchResults = document.getElementById('searchResults');
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalDate = document.getElementById('modalDate');

// Vista: Crear tarjeta
export function createImageCard(item, openModalCallback) {
    const data = item.data[0];
    const imageUrl = item.links && item.links[0] ? item.links[0].href : '';
    if (!imageUrl) return null;

    const card = document.createElement('div');
    card.className = 'image-card';
    const date = data.date_created ? new Date(data.date_created).toLocaleDateString('es-ES') : 'Fecha no disponible';
    const description = data.description ? 
        data.description.substring(0, 150) + (data.description.length > 150 ? '...' : '') : 
        'Sin descripción disponible';

    card.innerHTML = `
        <img src="${imageUrl}" alt="${data.title || 'Imagen NASA'}" loading="lazy">
        <div class="card-info">
            <h3 class="card-title">${data.title || 'Sin título'}</h3>
            <p class="card-date">📅 ${date}</p>
            <p class="card-description">${description}</p>
        </div>
    `;

    card.addEventListener('click', () => openModalCallback(item));
    return card;
}

// Vista: Abrir modal
export function openModal(item) {
    const data = item.data[0];
    const imageUrl = item.links && item.links[0] ? item.links[0].href : '';
    if (!imageUrl) return;

    modalImage.src = imageUrl;
    modalTitle.textContent = data.title || 'Sin título';
    modalDescription.textContent = data.description || 'Sin descripción disponible';
    modalDate.textContent = `Fecha: ${data.date_created ? new Date(data.date_created).toLocaleDateString('es-ES') : 'No disponible'}`;
    modal.style.display = 'block';
}

// Vista: Cerrar modal
export function closeModal() {
    modal.style.display = 'none';
}

// Vista: Loading/Error
export function showLoading(gallery, message = 'Cargando...') {
    gallery.innerHTML = `<div class="loading">${message}</div>`;
}

export function showError(gallery, message = 'Error al cargar las imágenes') {
    gallery.innerHTML = `<div class="error">${message}</div>`;
}

// Exportamos referencias para el controlador
export const DOMRefs = { mainGallery, galleryTitle, searchGallery, searchResults, modal };
