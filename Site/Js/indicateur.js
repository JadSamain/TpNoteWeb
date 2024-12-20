// Récupérer et parser les données JSON depuis sessionStorage
const data = JSON.parse(sessionStorage.getItem('jsonData'));

if (!data) {
    console.error('Aucune donnée trouvée dans le local storage avec le nom "jsonData"');
} else {
    // Afficher les indicateurs
    d3.select("#indicator1").html(`${Object.keys(data).length} festivals en France`);
    d3.select("#indicator2").text(`Indicateur 2: ${data.indicator2 || 'N/A'}`);
    d3.select("#indicator3").text(`Indicateur 3: ${data.indicator3 || 'N/A'}`);

    // Préparation des données : Top 10 du nombre de festivals par région
    const regionCounts = {};

    // Parcourir les données pour compter les festivals par région
    data.forEach(d => {
        const region = d["Région principale de déroulement"];
        if (region) {
            regionCounts[region] = (regionCounts[region] || 0) + 1;
        }
    });

    // Convertir les données en tableau { region, count }
    const regionData = Object.entries(regionCounts)
        .map(([region, count]) => ({ region, count }))
        .sort((a, b) => b.count - a.count) // Trier par nombre décroissant
        .slice(0, 10); // Prendre les 10 premiers

    // Création du graphique à barres horizontales pour le Top 10
    const chart1 = d3.select("#chart1");
    const chart1Width = parseInt(chart1.style("width"));
    const chart1Height = parseInt(chart1.style("height"));

    // Marges pour l'affichage des axes et des labels
    const margin = { top: 50, right: 50, bottom: 30, left: 150 };
    const width = chart1Width - margin.left - margin.right;
    const height = chart1Height - margin.top - margin.bottom;

    // Création du SVG
    const svg1 = chart1.append("svg")
        .attr("width", chart1Width)
        .attr("height", chart1Height)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Échelles X et Y pour les barres horizontales
    const xScale1 = d3.scaleLinear()
        .domain([0, d3.max(regionData, d => d.count)])
        .range([0, width]);

    const yScale1 = d3.scaleBand()
        .domain(regionData.map(d => d.region))
        .range([0, height])
        .padding(0.1);

    // Ajouter les barres horizontales
    svg1.selectAll("rect")
        .data(regionData)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", d => yScale1(d.region))
        .attr("width", d => xScale1(d.count))
        .attr("height", yScale1.bandwidth())
        .attr("fill", "steelblue");

    // Ajouter les étiquettes des valeurs sur les barres
    svg1.selectAll("text.value")
        .data(regionData)
        .enter()
        .append("text")
        .attr("class", "value")
        .attr("x", d => xScale1(d.count) + 5) // Positionner légèrement après la barre
        .attr("y", d => yScale1(d.region) + yScale1.bandwidth() / 2)
        .attr("dy", "0.35em") // Centrer verticalement
        .text(d => d.count)
        .style("font-size", "12px")
        .style("fill", "black");

    // Ajouter l'axe Y (noms des régions)
    svg1.append("g")
        .call(d3.axisLeft(yScale1))
        .selectAll("text")
        .style("font-size", "12px");

    // Ajouter l'axe X (nombre de festivals)
    svg1.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale1).ticks(5))
        .style("font-size", "12px");

    // Ajouter un titre au graphique
    svg1.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Top 10 des régions par nombre de festivals");
}
