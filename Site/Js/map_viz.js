document.addEventListener('DOMContentLoaded', function () {
  const jsonData = JSON.parse(sessionStorage.getItem('jsonData'));
  if (jsonData) {
    initializeMap(jsonData);
  } else {
    console.error('No data found in sessionStorage');
  }

  function initializeMap(data) {
    const map = L.map('map', {
      center: [46.603354, 1.888334],
      zoom: 6,
      zoomControl: false // Disable the default zoom control
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Add zoom control to the bottom left
    L.control.zoom({
      position: 'bottomleft'
    }).addTo(map);

    // Regroupement des festivals par département
    const departmentFestivals = {};
    data.forEach(item => {
      const department = item['Département principal de déroulement'];
      if (department) {
        if (!departmentFestivals[department]) {
          departmentFestivals[department] = { count: 0 };
        }
        departmentFestivals[department].count++;
      }
    });

    // Chargement des limites des départements (GeoJSON)
    fetch('https://france-geojson.gregoiredavid.fr/repo/departements.geojson')
      .then(response => response.json())
      .then(departmentBoundaries => {
        L.geoJSON(departmentBoundaries, {
          style: feature => {
            const department = feature.properties.nom;
            const intensity = departmentFestivals[department]?.count || 0;
            const color = intensity > 100 ? 'red' : intensity > 50 ? 'orange' : intensity > 25 ? 'yellow' : 'green';
            return { color, fillOpacity: 0.7 };
          },
          onEachFeature: (feature, layer) => {
            const department = feature.properties.nom;
            const count = departmentFestivals[department]?.count || 0;
            layer.bindPopup(`<b>${department}</b><br>Nombre de festivals : ${count}`);
            layer.on('click', function () {
              this.openPopup();
            });
          }
        }).addTo(map);
      })
      .catch(error => console.error('Erreur lors du chargement du GeoJSON:', error));

    // Ajouter une légende au coin inférieur droit et la remonter
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'info legend');
      const grades = [0, 25, 50, 100];
      const colors = ['green', 'yellow', 'orange', 'red'];

      // Titre de la légende
      div.innerHTML = '<h4 style="margin-bottom: 10px;">Nombre de Festivals</h4>';

      // Ajouter des plages de couleurs
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          `<div style="display: flex; align-items: center; margin-bottom: 5px;">
            <i style="width: 20px; height: 20px; background-color: ${colors[i]}; border-radius: 3px; margin-right: 10px;"></i>
            ${grades[i]}${grades[i + 1] ? ` &ndash; ${grades[i + 1]}` : '+'}
          </div>`;
      }

      return div;
    };

    legend.addTo(map);
  }
});