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
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: true
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
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
     * Calculates the new Y value based on the last Y value and the input change.
     */
    document.getElementById('dataForm').addEventListener('submit', function(event) {
        event.preventDefault();

        /**
         * @type {number} yValueChange - The rating change entered by the user.
         */
        const yValueChange = parseFloat(document.getElementById('yValue').value);

        /**
         * @type {number} lastYValue - The last Y value in the dataset. Defaults to 0 if no data exists.
         */
        const lastYValue = dynamicChart.data.datasets[0].data.length > 0
            ? dynamicChart.data.datasets[0].data[dynamicChart.data.datasets[0].data.length - 1]
            : 0;

        /**
         * @type {number} newYValue - The new Y value calculated by adding the change to the last Y value.
         */
        const newYValue = lastYValue + yValueChange;

        dynamicChart.data.labels.push(`Game ${gameNumber}`); // Automatically assign game number
        dynamicChart.data.datasets[0].data.push(newYValue);
        dynamicChart.update();

        gameNumber++;

        document.getElementById('yValue').value = '';
    });

    /**
     * Exports the chart data to a JSON file.
     */
    document.getElementById('exportData').addEventListener('click', () => {
        /**
         * @type {Object} data - The chart data to be exported.
         * @property {string[]} labels - The X-axis labels (game numbers).
         * @property {number[]} dataset - The Y-axis data (rating changes).
         */
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
     * Updates the chart with the imported data and adjusts the game number.
     */
    document.getElementById('importData').addEventListener('change', (event) => {
        /**
         * @type {File} file - The selected JSON file.
         */
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                /**
                 * @type {Object} importedData - The parsed JSON data from the file.
                 * @property {string[]} importedData.labels - The X-axis labels (game numbers).
                 * @property {number[]} importedData.dataset - The Y-axis data (rating changes).
                 */
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


