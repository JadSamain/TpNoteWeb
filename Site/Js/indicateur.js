// Récupérer et parser les données JSON depuis sessionStorage
const data = JSON.parse(sessionStorage.getItem('jsonData'));

if (!data) {
    console.error('Aucune donnée trouvée dans le local storage avec le nom "jsonData"');
} else {
    // Comptage des régions
    const regionCounts = {};
    const departmentCounts = {};
    const disciplineCounts = {};

    // Parcourir les données pour compter les festivals par région, département et disciplines
    data.forEach(d => {
        const region = d["Région principale de déroulement"];
        const department = d["Département principal de déroulement"];
        const disciplines = d["Discipline dominante"];

        if (region) {
            regionCounts[region] = (regionCounts[region] || 0) + 1;
        }

        if (department) {
            departmentCounts[department] = (departmentCounts[department] || 0) + 1;
        }

        if (disciplines) {
            disciplines.split(",").forEach(discipline => {
                const trimmedDiscipline = discipline.trim();
                disciplineCounts[trimmedDiscipline] = (disciplineCounts[trimmedDiscipline] || 0) + 1;
            });
        }
    });

    // Identifier les départements et régions les plus représentés
    const topDepartment = Object.entries(departmentCounts)
        .reduce((max, current) => current[1] > max[1] ? current : max, ["", 0]);

    const topRegion = Object.entries(regionCounts)
        .reduce((max, current) => current[1] > max[1] ? current : max, ["", 0]);

    // Afficher les indicateurs
    d3.select("#indicator1").html(`${data.length} festivals en France`);
    d3.select("#indicator2").html(`Département le plus représenté : ${topDepartment[0]} (${topDepartment[1]} festivals)`);
    d3.select("#indicator3").html(`Région la plus représentée : ${topRegion[0]} (${topRegion[1]} festivals)`);

    // Préparer les données pour le graphique des régions
    const regionData = Object.entries(regionCounts)
        .map(([region, count]) => ({ region, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 régions

    // Création du graphique à barres horizontales
    const chart1 = d3.select("#chart1");
    const chart1Width = parseInt(chart1.style("width"));
    const chart1Height = parseInt(chart1.style("height"));
    const margin = { top: 50, right: 50, bottom: 30, left: 150 };
    const width = chart1Width - margin.left - margin.right;
    const height = chart1Height - margin.top - margin.bottom;

    const svg1 = chart1.append("svg")
        .attr("width", chart1Width)
        .attr("height", chart1Height)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale1 = d3.scaleLinear()
        .domain([0, d3.max(regionData, d => d.count)])
        .range([0, width]);

    const yScale1 = d3.scaleBand()
        .domain(regionData.map(d => d.region))
        .range([0, height])
        .padding(0.1);

    svg1.selectAll("rect")
        .data(regionData)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", d => yScale1(d.region))
        .attr("width", d => xScale1(d.count))
        .attr("height", yScale1.bandwidth())
        .attr("fill", "steelblue");

    svg1.selectAll("text.value")
        .data(regionData)
        .enter()
        .append("text")
        .attr("class", "value")
        .attr("x", d => xScale1(d.count) + 5)
        .attr("y", d => yScale1(d.region) + yScale1.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text(d => d.count)
        .style("font-size", "12px")
        .style("fill", "black");

    svg1.append("g")
        .call(d3.axisLeft(yScale1))
        .selectAll("text")
        .style("font-size", "12px");

    svg1.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale1).ticks(5))
        .style("font-size", "12px");

    svg1.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Top 10 des régions par nombre de festivals");

    // Préparer les données pour le diagramme circulaire
    const pieData = Object.entries(disciplineCounts)
        .map(([discipline, count]) => ({ discipline, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5 disciplines

    // Création du diagramme circulaire
    const chart2 = d3.select("#chart2"); // Assurez-vous que la nouvelle section a l'ID "chart2"
    const chart2Width = parseInt(chart2.style("width"));
    const chart2Height = parseInt(chart2.style("height"));
    const radius = Math.min(chart2Width, chart2Height) / 2;

    const svg2 = chart2.append("svg")
        .attr("width", chart2Width)
        .attr("height", chart2Height)
        .append("g")
        .attr("transform", `translate(${chart2Width / 2}, ${chart2Height / 2})`);

    const color = d3.scaleOrdinal()
        .domain(pieData.map(d => d.discipline))
        .range(d3.schemeCategory10);

    const pie = d3.pie()
        .value(d => d.count);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    svg2.selectAll("path")
        .data(pie(pieData))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.discipline))
        .attr("stroke", "white")
        .style("stroke-width", "2px");

    svg2.selectAll("text")
        .data(pie(pieData))
        .enter()
        .append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text(d => `${d.data.discipline} (${d.data.count})`);

    svg2.append("text")
        .attr("x", 0)
        .attr("y", -radius - 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Top 5 des types de festivals les plus représentés");
}
