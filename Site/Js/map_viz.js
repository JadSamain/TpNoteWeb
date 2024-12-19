document.addEventListener('DOMContentLoaded', function () {
  const jsonData = JSON.parse(localStorage.getItem('jsonData'));

  if (jsonData) {
    initializeMap(jsonData);
  } else {
    console.error('No JSON data found in localStorage.');
  }
});

function initializeMap(data) {
  const map = L.map('map').setView([46.603354, 1.888334], 6); // Initialiser la carte avec une vue centrée sur la France

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  data.forEach(item => {
    // Nettoyer les clés et les valeurs des objets JSON
    const cleanedItem = {};
    Object.keys(item).forEach(key => {
      const cleanedKey = key.trim();
      cleanedItem[cleanedKey] = item[key].trim();
    });

    const geocodage = cleanedItem['Géocodage xy'];
    if (geocodage) {
      const [lat, lon] = geocodage.split(',').map(coord => parseFloat(coord.trim()));
      if (!isNaN(lat) && !isNaN(lon)) {
        L.marker([lat, lon]).addTo(map)
          .bindPopup(`<b>${cleanedItem['Nom du festival']}</b><br>${cleanedItem['Commune principale de déroulement']}`);
      }
    }
  });
}