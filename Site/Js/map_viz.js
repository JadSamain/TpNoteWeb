import L from 'leaflet';

const map = L.map('map').setView([51.505, -0.09], 13);

// Add a tile layer to the map (OpenStreetMap tiles)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to load JSON data and add markers to the map
function loadJsonData(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const marker = L.marker([item.lat, item.lng]).addTo(map);
                marker.bindPopup(`<b>${item.name}</b><br>${item.description}`).openPopup();
            });
        })
        .catch(error => console.error('Error loading JSON data:', error));
}

// Example usage: Load data from a JSON file
loadJsonData('data/locations.json');