document.addEventListener('DOMContentLoaded', function() {
    fetch('Source/festivals-global-festivals-_-pl.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n');
            let table = '<table border="1">';
            rows.forEach(row => {
                const cols = row.split(';');
                table += '<tr>';
                cols.forEach(col => {
                    table += `<td>${col}</td>`;
                });
                table += '</tr>';
            });
            table += '</table>';
            document.body.innerHTML += table;
        });
});

function csvToJson(csv) {
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);
    }

    return JSON.stringify(result
    , null, 2);
    }