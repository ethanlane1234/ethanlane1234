/* Developed by Ethan Lane
sources: uses the public, overfast api
*/


/* API functions */
var selectedPlayer = 'NightTrain-11944'; // default profile

/* Gets all information about a player */
async function getPlayer(BattleTag) { /* depreciated */
    var url = 'https://overfast-api.tekrop.fr/players/' + BattleTag;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log(data);
        sessionStorage.setItem(BattleTag, JSON.stringify(data));
        updateChart(data);
        document.getElementById('battletag').innerText = `BattleTag: ${BattleTag}`; // Update BattleTag tag
    } catch (error) {
        console.error(error, 'not ok');
    }
}
/* Gets stat summary information about a player */
async function getPlayerStatsSummary(BattleTag) {
    var url = 'https://overfast-api.tekrop.fr/players/' + BattleTag + '/stats/summary';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('not ok ' + response.statusText);
        }
        const data = await response.json();
        sessionStorage.setItem(BattleTag, JSON.stringify(data));
        return data;
    } catch (error) {
        console.error(error, 'not ok');
    }
}
/* Gets all information about all heroes */
async function getHeroes() {
    var url = 'https://overfast-api.tekrop.fr/heroes';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('not ok ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error, 'not ok');
        return null;
    }
}
/* iterates though a json file */
function iterateStorage(jsonData) {
    for (const hero of jsonData) {
        console.log(`Name: ${hero.name}, Role: ${hero.role}`);
    }    
}


/* Graphing */
/* adds a piece of selected player data to the chart */
async function addPlayerData() {
    const battleTagInput = document.getElementById('battleTagInput').value;
    if (battleTagInput) {
        selectedPlayer = battleTagInput;
        document.getElementById('battletag').innerText = `BattleTag: ${selectedPlayer}`; // Update the BattleTag display
    }
    updateChart()
}
/* The graph */
const ctx = document.getElementById('playerChart').getContext('2d');
const playerChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: '',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        plugins: {
            title: {
                display: true, // Enable the title
                text: 'Custom Stat View', // Set the title text
                font: {
                    size: 18 // Optional: Set the font size
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                playerChart.data.labels.splice(index, 1);
                playerChart.data.datasets[0].data.splice(index, 1);
                playerChart.update();
            }
        }
    }
});
/* updates the chart with the requested information */
async function updateChart() {
    console.log(selectedPlayer)
    data = await getPlayerStatsSummary(selectedPlayer);
    updateStatChart(data);
    var playerValue = data.heroes;
    if (!document.getElementById('heroDropdown').value) {
        alert('select a hero first');
        throw console.error('user error'); /* stops the user from breaking the program, ignore the errors from this line*/
    }
    if ( !document.getElementById('statDropdown').value) {
        alert('select a stat first');
        throw console.error('user error'); /* stops the user from breaking the program, ignore the errors from this line*/
    }
    
    for (const [key, value] of Object.entries(playerValue)) {
        if (key === document.getElementById('heroDropdown').value) {
            console.log('key:', key, 'value', value);
            playerValue = value;
            playerChart.data.labels.push(key); // graph label
        }
    }

    for (const [key, value] of Object.entries(playerValue)) {
        if (key === document.getElementById('statDropdown').value) {
            console.log('key:', key, 'value', value);
            playerValue = value;
        }
    }
    
    playerChart.data.datasets[0].data.push(playerValue); //graph data
    playerChart.update();
}
/* Drop Down Menu */
/* adds values to hero dropdown */
async function populateDropdown(elementId) { 
    const dropdown = document.getElementById(elementId);
    heroes = await getHeroes(); // needs to be async so that we can await here
    heroes.forEach(hero => {
        const option = document.createElement("option");
        option.value = hero.key; // Use the key as the value
        option.textContent = hero.name; // Display name in dropdown
        dropdown.appendChild(option);
    });
}
/* adds values to stat dropdown */
async function populateStatDropdown(elementId) { 
    const dropdown = document.getElementById(elementId);
    stat = await getPlayerStatsSummary(selectedPlayer); // needs to be async so that we can await here
    for (const [key] of Object.entries(stat.general)) {
        const option = document.createElement("option");
        option.value = key; // Use the key as the value
        option.textContent = key; // Display name in dropdown
        dropdown.appendChild(option);
    }
}

async function getHeroStats(heroName) {
    statsData = await getPlayerStatsSummary();
    if (statsData.heroes[heroName]) {
        return statsData.heroes[heroName];
    } else {
        return "Hero not found";
    }
}

/* content */

populateDropdown('heroDropdown');
populateStatDropdown('statDropdown');

/* MISC */
/* dsiplays all stats related to the currently selected hero in regard to the selected player */
async function displayStats() {
    const heroName = document.getElementById("heroDropdown").value;
    const statsContainer = document.getElementById("stats-container");
    statsData = await getPlayerStatsSummary(selectedPlayer);
    if (heroName && statsData.heroes[heroName]) {
        const stats = statsData.heroes[heroName];
        let statsHtml = `<h2>${heroName.charAt(0).toUpperCase() + heroName.slice(1)}'s Stats</h2>`;
        for (const [key, value] of Object.entries(stats)) {
            statsHtml += `<p><strong>${key}:</strong> ${value}</p>`;
        }
        statsContainer.innerHTML = statsHtml;
    } else {
        statsContainer.innerHTML = `<h2>Stats</h2><p>Select a hero to see their stats.</p>`;
    }
}
/* saves data to a json format */
function saveData(data) {
    document.getElementById('write').innerText = JSON.stringify(data, null, 2);
}

/*  ################################# Non async and No direct API calls ####################################### */

/* graph of all stats per hero selection */
/* The graph */
const ctx2 = document.getElementById('statChart').getContext('2d');
const statChart = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: '',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fullsize: 1
        }]
    },
    options: {
        plugins: {
            title: {
                display: true, // Enable the title
                text: 'Stat Chart Title', // Set the title text
                font: {
                    size: 18 // Optional: Set the font size
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                statChart.data.labels.splice(index, 1);
                statChart.data.datasets[0].data.splice(index, 1);
                statChart.update();
            }
        }
    }
});

/* updates the chart with the requested information */
function updateStatChart(data) { /* call is nested inside call to other chart to reduce api calls */
    console.log(selectedPlayer)
    var playerValue = data.heroes;

    clearChart(statChart);

    if ( !document.getElementById('statDropdown').value) {
        alert('select a stat first');
        throw console.error('user error'); /* stops the user from breaking the program, ignore the errors from this line*/
    }

    for (const [key, value] of Object.entries(playerValue)) {
        playerValue = value;
        statChart.data.labels.push(key); // graph label
        for (const [key, value] of Object.entries(playerValue)) {
            console.log('key:', key, 'value', value, "datatopush:", value);
            
            if (key === document.getElementById('statDropdown').value) {
                statChart.data.datasets[0].data.push(value); //graph data
                statChart.options.plugins.title.text = key;

                statChart.update();
            }
            
        }
    }
}

function clearChart(chart) {
    chart.data.labels = []; // Clear labels
    chart.data.datasets.forEach((dataset) => {
        dataset.data = []; // Clear data for each dataset
    });
    chart.update(); // Update the chart to apply changes
}

/* test */

//getPlayer('NightTrain-11944'); /* depreciated for now gives too much data */ 
//addPlayerData('NightTrain-11944'); /* currently in use gives a managable amount of data */

// on first startup values are defaulted to to prevent errors, but that only happens because we run a test case without selecting proper feilds
// a user could also misuse it like this, so make this temporary solution better or permanent.

/* Notes 
3/26/25 -> to many api calls I need to simplify it to just grabbing the data once and storing it instead of repeated calls.
 There are also calls that I have that should only have to be called once
*/