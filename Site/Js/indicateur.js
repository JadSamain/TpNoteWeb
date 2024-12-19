const data = JSON.parse(localStorage.getItem('jsonData'));

if (!data) {
console.error('Aucune donnée trouvée dans le local storage avec le nom "jsondata"');
    } else {
    // Mise à jour des indicateurs
    d3.select("#indicator1").text(`Indicateur 1: ${data.indicator1 || 'N/A'}`);
    d3.select("#indicator2").text(`Indicateur 2: ${data.indicator2 || 'N/A'}`);
    d3.select("#indicator3").text(`Indicateur 3: ${data.indicator3 || 'N/A'}`);

    // Création du premier graphique à barres
    const chart1 = d3.select("#chart1");
    const chart1Width = parseInt(chart1.style("width"));
    const chart1Height = parseInt(chart1.style("height"));

    const svg1 = chart1.append("svg")
        .attr("width", chart1Width)
        .attr("height", chart1Height);

    const xScale1 = d3.scaleBand()
        .domain(data.chart1.map(d => d.label))
        .range([0, chart1Width])
        .padding(0.1);

    const yScale1 = d3.scaleLinear()
        .domain([0, d3.max(data.chart1, d => d.value)])
        .range([chart1Height, 0]);

    svg1.selectAll("rect")
        .data(data.chart1)
        .enter()
        .append("rect")
        .attr("x", d => xScale1(d.label))
        .attr("y", d => yScale1(d.value))
        .attr("width", xScale1.bandwidth())
        .attr("height", d => chart1Height - yScale1(d.value))
        .attr("fill", "steelblue");

    // Création du deuxième graphique à barres
    const chart2 = d3.select("#chart2");
    const chart2Width = parseInt(chart2.style("width"));
    const chart2Height = parseInt(chart2.style("height"));

    const svg2 = chart2.append("svg")
        .attr("width", chart2Width)
        .attr("height", chart2Height);

    const xScale2 = d3.scaleBand()
        .domain(data.chart2.map(d => d.label))
        .range([0, chart2Width])
        .padding(0.1);

    const yScale2 = d3.scaleLinear()
        .domain([0, d3.max(data.chart2, d => d.value)])
        .range([chart2Height, 0]);

    svg2.selectAll("rect")
        .data(data.chart2)
        .enter()
        .append("rect")
        .attr("x", d => xScale2(d.label))
        .attr("y", d => yScale2(d.value))
        .attr("width", xScale2.bandwidth())
        .attr("height", d => chart2Height - yScale2(d.value))
        .attr("fill", "orange");
}