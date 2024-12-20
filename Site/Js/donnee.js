document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('csvFileInput');
    const departmentFilter = document.getElementById('departmentFilter');
    const musicTypeFilter = document.getElementById('musicTypeFilter');
    const yearFilter = document.getElementById('yearFilter');
    const applyFiltersButton = document.getElementById('applyFilters');
    const resetFiltersButton = document.getElementById('resetFilters');
    let jsonData = null;
    let filteredData = null;

    // Vérifie si des données existent dans le sessionStorage
    const savedJsonData = sessionStorage.getItem('jsonData');
    if (savedJsonData) {
        jsonData = JSON.parse(savedJsonData);
        filteredData = jsonData;
        displayTable(filteredData); // Affiche les données existantes
    }

    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (!file) return; // Vérifie si un fichier a été sélectionné

        const reader = new FileReader();

        reader.onload = function (e) {
            const csvData = e.target.result; // Récupère les données CSV
            jsonData = csvToJson(csvData); // Convertit en JSON
            sessionStorage.setItem('jsonData', JSON.stringify(jsonData)); // Stocke dans sessionStorage
            filteredData = jsonData; // Initialise les données filtrées
            displayTable(filteredData); // Affiche le tableau
        };

        reader.readAsText(file); // Lit le fichier
    });

    applyFiltersButton.addEventListener('click', function () {
        if (!jsonData) return;

        const department = departmentFilter.value.trim().toLowerCase();
        const musicType = musicTypeFilter.value.trim().toLowerCase();
        const year = yearFilter.value.trim();

        filteredData = jsonData.filter(row => {
            const matchesDepartment = !department || row["Département principal de déroulement"].toLowerCase().includes(department);
            const matchesMusicType = !musicType || row["Discipline dominante"].toLowerCase().includes(musicType);
            const matchesYear = !year || row["Année de création du festival"] === year;

            return matchesDepartment && matchesMusicType && matchesYear;
        });

        displayTable(filteredData);
    });

    resetFiltersButton.addEventListener('click', function () {
        departmentFilter.value = '';
        musicTypeFilter.value = '';
        yearFilter.value = '';
        filteredData = jsonData;
        displayTable(filteredData);
    });

    // Fonction pour convertir CSV en JSON
    function csvToJson(csv) {
        const lines = csv.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) {
            alert('Le fichier CSV ne contient pas de données valides.');
            return [];
        }

        const result = [];
        const headers = lines[0].split(';');

        for (let i = 1; i < lines.length; i++) {
            const obj = {};
            const currentline = lines[i].split(';');
            headers.forEach((header, index) => {
                obj[header] = currentline[index] || '';
            });
            result.push(obj);
        }

        return result;
    }

    // Fonction pour afficher les données sous forme de tableau
    function displayTable(jsonData) {
        const tableContainer = document.querySelector('.table-container');
        tableContainer.innerHTML = ''; // Supprime les anciens contenus

        if (!jsonData || jsonData.length === 0) {
            tableContainer.innerHTML = '<p>Aucune donnée à afficher.</p>';
            return;
        }

        const table = document.createElement('table');
        table.border = '1';
        table.style.width = '100%';

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
        tableContainer.appendChild(table);
    }
});
