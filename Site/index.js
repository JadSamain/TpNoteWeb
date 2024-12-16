document.addEventListener('DOMContentLoaded', function() {
    fetch('Site/Source/festivals-global-festivals-_-pl.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n');
            let table = '<table border="1">';
            rows.forEach(row => {
                const cols = row.split(',');
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

