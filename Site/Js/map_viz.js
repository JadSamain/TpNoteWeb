// Initialisation de la carte et configuration de la vue
var map = L.map('map').setView([45.441343, 4.386274], 14); // Latitude, Longitude, Zoom (ici : Paris)

// Ajouter une couche de tuiles (tiles) OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Ajouter un marqueur
var marker = L.marker([45.441343, 4.386274]).addTo(map);
marker.bindPopup("Beurk, Saint Étienne").openPopup();
