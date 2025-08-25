// js/controllers/nasaController.js
import { searchNASA, categories } from "../models/nasaModel.js";
import { createImageCard, openModal, closeModal, showLoading, showError, DOMRefs } from "../views/nasaView.js";

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const filterButtons = document.querySelectorAll('.filter-btn');
const closeModalBtn = document.querySelector('.close');

let currentFilter = 'all';

// Cargar contenido por categoría
async function loadCategoryContent(category) {
    const gallery = DOMRefs.mainGallery;
    const config = categories[category];
    if (!config) return;

    DOMRefs.galleryTitle.textContent = config.title;
    showLoading(gallery);

    try {
        let allItems = [];
        for (const query of config.queries) {
            const items = await searchNASA(query, category === 'all' ? 6 : 12);
            allItems = allItems.concat(items);
        }

        const uniqueItems = allItems.filter((item, index, self) => 
            index === self.findIndex(i => i.data[0].nasa_id === item.data[0].nasa_id)
        );

        const limitedItems = uniqueItems.slice(0, category === 'all' ? 30 : 24);

        if (limitedItems.length === 0) {
            gallery.innerHTML = `<div class="error">No se encontraron imágenes</div>`;
            return;
        }

        gallery.innerHTML = '';
        limitedItems.forEach(item => {
            const card = createImageCard(item, openModal);
            if (card) gallery.appendChild(card);
        });
    } catch (error) {
        console.error('Error al cargar contenido:', error);
        showError(gallery);
    }
}

// Buscar imágenes personalizadas
async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) {
        alert('Por favor, ingresa un término de búsqueda');
        return;
    }

    DOMRefs.searchResults.style.display = 'block';
    DOMRefs.searchResults.scrollIntoView({ behavior: 'smooth' });
    showLoading(DOMRefs.searchGallery, 'Buscando...');

    try {
        const items = await searchNASA(query, 20);
        if (items.length === 0) {
            DOMRefs.searchGallery.innerHTML = '<div class="error">No se encontraron resultados</div>';
            return;
        }

        DOMRefs.searchGallery.innerHTML = '';
        items.forEach(item => {
            const card = createImageCard(item, openModal);
            if (card) DOMRefs.searchGallery.appendChild(card);
        });
    } catch (error) {
        console.error('Error en búsqueda:', error);
        showError(DOMRefs.searchGallery, 'Error al realizar la búsqueda');
    }
}

// Manejo de filtros
function handleFilterChange(filterValue) {
    currentFilter = filterValue;
    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filterValue);
    });
    DOMRefs.searchResults.style.display = 'none';
    loadCategoryContent(filterValue);
}

// Inicializar app
export function initApp() {
    loadCategoryContent('all');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.dataset.filter;
            if (filterValue !== currentFilter) handleFilterChange(filterValue);
        });
    });

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', e => { if (e.key === 'Enter') performSearch(); });
    closeModalBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}
