// js/models/nasaModel.js
const NASA_API_BASE = 'https://images-api.nasa.gov/search';

export const categories = {
    all: {
        title: '🌌 Todas las categorías',
        queries: ['space', 'solar system', 'galaxy', 'nebula', 'stars', 'planets']
    },
    planets: {
        title: '🪐 Planetas',
        queries: ['mars', 'jupiter', 'saturn', 'venus', 'mercury', 'earth', 'neptune', 'uranus', 'planet', 'solar system']
    },
    stars: {
        title: '⭐ Estrellas',
        queries: ['sun', 'solar', 'star', 'stellar', 'solar flare', 'corona']
    },
    galaxies: {
        title: '🌌 Galaxias',
        queries: ['galaxy', 'milky way', 'andromeda', 'spiral galaxy', 'elliptical galaxy', 'cosmic']
    },
    nebulae: {
        title: '☁️ Nebulosas',
        queries: ['nebula', 'crab nebula', 'orion nebula', 'eagle nebula', 'horsehead nebula', 'emission nebula']
    }
};

// Función que se comunica con la API
export async function searchNASA(query, limit = 10) {
    try {
        const response = await fetch(`${NASA_API_BASE}?q=${encodeURIComponent(query)}&media_type=image&page_size=${limit}&year_start=2000`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const data = await response.json();
        return data.collection.items || [];
    } catch (error) {
        console.error('Error al buscar en NASA API:', error);
        return [];
    }
}
