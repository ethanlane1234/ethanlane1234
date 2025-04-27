/**
 * Developed by Ethan Lane
 * Started: 3/17/25
 */

document.addEventListener('DOMContentLoaded', () => {
    /**
     * Initializes the line chart.
     * @type {Chart}
     */
    const ctx = document.getElementById('dynamicChart').getContext('2d');
    const dynamicChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Match Rating Change',
                data: [],
                borderWidth: 2,
                fill: false, // No background fill
                segment: {
                    borderColor: ctx => {
                        const { p0, p1 } = ctx;
                        if (!p0 || !p1) return 'gray'; // fallback

                        // Color decision based on next point (p1)
                        if (p1.parsed.y > 0 && p1.parsed.y < 300) {
                            document.getElementById('rank').innerHTML = 'Bronze';
                            return 'brown'; // bronze
                        } else if (p1.parsed.y >= 300 && p1.parsed.y < 600) {
                            document.getElementById('rank').innerHTML = 'Silver';
                            return 'silver'; // silver
                        } else if (p1.parsed.y >= 600 && p1.parsed.y < 900) {
                            document.getElementById('rank').innerHTML = 'Gold';
                            return 'gold'; // gold 
                        } else if (p1.parsed.y >= 900 && p1.parsed.y < 1200) {
                            document.getElementById('rank').innerHTML = 'Platium';
                            return 'teal'; // plat
                        } else if (p1.parsed.y >= 1200 && p1.parsed.y < 1500) {
                            document.getElementById('rank').innerHTML = 'Diamond';
                            return 'blue'; // diamond
                        } else if (p1.parsed.y >= 1500 && p1.parsed.y < 1800) {
                            document.getElementById('rank').innerHTML = 'Grand Master';
                            return 'purple'; // //gm
                        } else if (p1.parsed.y >= 1800 && p1.parsed.y < 2100) {
                            document.getElementById('rank').innerHTML = 'Celestial';
                            return 'orange'; // cel
                        } else if (p1.parsed.y >= 2100 && p1.parsed.y < 2400) {
                            document.getElementById('rank').innerHTML = 'Eternity';
                            return 'lightred'; // Eternity
                        } else if (p1.parsed.y >= 2400) {
                            document.getElementById('rank').innerHTML = 'One-Above-All';
                            return 'red' // one above all
                        }
                    }
                }
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            },
            elements: {
                line: {
                    tension: 0.4 // a little smoothing between points (optional)
                }
            }
        }
    });

    /**
     * Tracks the current game number for the X-axis.
     * @type {number}
     */
    let gameNumber = 1;

    /**
     * Handles form submission to add new data to the chart.
     */
    document.getElementById('dataForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const yValueChange = parseFloat(document.getElementById('yValue').value);

        const lastYValue = dynamicChart.data.datasets[0].data.length > 0
            ? dynamicChart.data.datasets[0].data[dynamicChart.data.datasets[0].data.length - 1]
            : 0;

        const newYValue = lastYValue + yValueChange;

        dynamicChart.data.labels.push(`Game ${gameNumber}`);
        dynamicChart.data.datasets[0].data.push(newYValue);
        dynamicChart.update();

        gameNumber++;

        document.getElementById('yValue').value = '';
    });

    /**
     * Exports the chart data to a JSON file.
     */
    document.getElementById('exportData').addEventListener('click', () => {
        const data = {
            labels: dynamicChart.data.labels,
            dataset: dynamicChart.data.datasets[0].data
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chart_data.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    /**
     * Imports chart data from a JSON file.
     */
    document.getElementById('importData').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const importedData = JSON.parse(e.target.result);
                dynamicChart.data.labels = importedData.labels;
                dynamicChart.data.datasets[0].data = importedData.dataset;
                dynamicChart.update();

                gameNumber = importedData.labels.length + 1;
            };
            reader.readAsText(file);
        }
    });
});
