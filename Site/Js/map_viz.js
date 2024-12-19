// Initialisation de la carte et configuration de la vue
var map = L.map('map').setView([45.441343, 4.386274], 14); // Latitude, Longitude, Zoom (ici : Paris)

// Ajouter une couche de tuiles (tiles) OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fonction pour lire le fichier CSV et afficher les points sur la carte
function afficherPointsSurCarte() {
  const csvData = localStorage.getItem('csvData'); // Lire le CSV depuis le localStorage
  if (!csvData) {
    console.error('Aucun fichier CSV trouvé dans le localStorage');
    return;
  }

  const lignes = csvData.split('\n');
  const headers = lignes[0].split(','); // Lire les en-têtes
  const geocodageIndex = headers.indexOf('Géocodage XY'); // Trouver l'index de la colonne "Géocodage XY"

  if (geocodageIndex === -1) {
    console.error('Colonne "Géocodage XY" non trouvée dans le fichier CSV');
    return;
  }

  lignes.slice(1).forEach(ligne => { // Ignorer la première ligne (en-têtes)
    const colonnes = ligne.split(',');
    const geocodage = colonnes[geocodageIndex];
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