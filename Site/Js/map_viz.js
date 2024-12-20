document.addEventListener('DOMContentLoaded', function () {
  // Exemple de données pour les festivals
  fetch('Source/festivals-global-festivals-_-pl.csv')
    .then(response => response.text())
    .then(csvData => {
      const jsonData = csvToJson(csvData);
      localStorage.setItem('jsonData', JSON.stringify(jsonData));
      initializeMap(jsonData);
    });

  function csvToJson(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(';');
    return lines.slice(1).map(line => {
      const values = line.split(';');
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {});
    });
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
                fetch('Js/departements-1000m.geojson')
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
                
                // Add legend to the map
                const legend = L.control({ position: 'bottomright' });
                
                legend.onAdd = function (map) {
                  const div = L.DomUtil.create('div', 'info legend');
                  const grades = [0, 25, 50, 100];
                  const labels = ['<strong>Nombre de festivals</strong>'];
                  const colors = ['green', 'yellow', 'orange', 'red'];
                
                  for (let i = 0; i < grades.length; i++) {
                    labels.push(
                      '<i style="background:' + colors[i] + '"></i> ' +
                      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] : '+')
                    );
                  }
                
                  div.innerHTML = labels.join('<br>');
                  return div;
                };
                
                                legend.addTo(map);
                              }
                            }
                          );
                