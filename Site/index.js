document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('csvFileInput');
    const convertButton = document.getElementById('convertButton');
    let csvData = ''; // Variable pour stocker temporairement les données CSV

    // Événement pour récupérer le fichier sélectionné
    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {csvData = e.target.result;};
            reader.readAsText(file);
        }
    });

    // Événement pour convertir et afficher les données dans un tableau
    convertButton.addEventListener('click', function () {
        const jsonData = csvToJson(csvData);
        displayTable(jsonData);
    });
});


// Fonction pour convertir le CSV en JSON
function csvToJson(csv) {
    const lines = csv.split('\n').filter(line => line.trim() !== ''); // Supprime les lignes vides
    const result = [];
    const headers = lines[0].split(';'); // Utilise la première ligne comme en-tête avec ; comme séparateur

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(';'); // Utilise ; comme séparateur

        headers.forEach((header, index) => {
            obj[header] = currentline[index] || ''; // Remplit avec une chaîne vide si aucune donnée
        });

        result.push(obj);
    }

    return result;
}

// Fonction pour afficher un tableau HTML à partir du JSON
function displayTable(jsonData) {
    // Supprime les tableaux existants pour éviter les duplications
    const existingTable = document.querySelector('table');
    if (existingTable) {
        existingTable.remove();
    }

    // Créer le tableau
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';

    // Ajouter une ligne d'en-tête
    const headers = Object.keys(jsonData[0]);
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.style.padding = '8px';
        th.style.textAlign = 'left';
        th.style.backgroundColor = '#f2f2f2';
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Ajouter les données
    const tbody = document.createElement('tbody');
    jsonData.forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header];
            td.style.padding = '8px';
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    document.body.appendChild(table);
}
