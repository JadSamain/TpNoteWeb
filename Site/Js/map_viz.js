// Initialisation de la carte et configuration de la vue
var map = L.map('map').setView([45.441343, 4.386274], 14); // Latitude, Longitude, Zoom (ici : Paris)

// Ajouter une couche de tuiles (tiles) OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fonction pour lire le fichier JSON et afficher les points sur la carte
function afficherPointsSurCarte() {
  const jsonData = localStorage.getItem('jsonData'); // Lire le JSON depuis le localStorage
  if (!jsonData) {
    console.error('Aucun fichier JSON trouvé dans le localStorage');
    return;
  }

  jsonData.forEach(row => {
    const geocodage = row['"Géocodage xy "'];
    if (geocodage) {
      const [lat, lng] = geocodage.split(',').map(coord => parseFloat(coord.trim()));
      if (!isNaN(lat) && !isNaN(lng)) {
        L.marker([lat, lng]).addTo(map);
      }
    }
  });
}

// Appel de la fonction pour afficher les points sur la carte
afficherPointsSurCarte();