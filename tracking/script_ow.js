/*  Developed by Ethan Lane
    Stated: 3/17/25
    sources: uses the publicly avaible, overfast api
                                                                    
/* ################################# Session Storage ####################################### */
/**
 * Retrieves a list of players stored in sessionStorage.
 * @returns {Object} An object containing player names as keys and their data as values.
 */
function getPlayersFromSession() {
    const playerNames = JSON.parse(sessionStorage.getItem('playerNames') || '[]'); // Ensure valid JSON
    const players = {};
    playerNames.forEach(name => {
        const playerData = sessionStorage.getItem(name);
        if (playerData && playerData !== "undefined") { // Check for valid JSON
            players[name] = JSON.parse(playerData);
        }
    });
    return players;
}

/**
 * Retrieves the data of a specific player from sessionStorage.
 * @param {string} selectedPlayer - The BattleTag of the player to retrieve.
 * @returns {Object|null} The player's data or null if not found.
 */
function getPlayerFromSession(selectedPlayer) {
    return JSON.parse(sessionStorage.getItem(selectedPlayer));
}

/**
 * Stores a player's summary data in sessionStorage.
 * @param {string} playerName - The BattleTag of the player.
 * @param {Object} playerData - The player's summary data to store.
 */
function addPlayerToSession(playerName, playerData) {
    const playerNames = JSON.parse(sessionStorage.getItem('playerNames')) || [];
    if (!playerNames.includes(playerName)) {
        playerNames.push(playerName);
        sessionStorage.setItem('playerNames', JSON.stringify(playerNames));
    }
    sessionStorage.setItem(playerName, JSON.stringify(playerData));
}

/**
 * Retrieves hero data from sessionStorage.
 * @returns {Object|null} The hero data or null if not found.
 */
function getHeroesFromSession() {
    return JSON.parse(sessionStorage.getItem('heroes'));
}
/* ####################################################################### */

/* Gobal Variables */
var selectedPlayer = 'NightTrain-11944';
var hero_stats = getHeroesFromSession();
var player_summary = getPlayerFromSession(selectedPlayer);
var mode = null;

/* Main */
ASYNC_main();
document.addEventListener('DOMContentLoaded', populateBattleTagList);

/* ################################# API functions ###################################### */

/**
 * Main asynchronous function to initialize data and populate dropdowns.
 * Fetches hero stats and player summaries if not already stored.
 */
async function ASYNC_main() { // these variables/functions need to use the await keyword
    if (!hero_stats){hero_stats = await getHeroes();console.log('fetching hero names');}
    if (!player_summary){player_summary = await getPlayerStatsSummary(selectedPlayer);console.log('fetching player summary');}
    await populateDropdown('heroDropdown');
    await populateStatDropdown('statDropdown');

    addPlayerToSession(selectedPlayer, player_summary);
    sessionStorage.setItem('heroes', JSON.stringify(hero_stats));
    
}

/**
 * Fetches all information about a player.
 * @param {string} BattleTag - The BattleTag of the player.
 * @deprecated This function is no longer used.
 */
async function getPlayer(BattleTag) {
    var url = 'https://overfast-api.tekrop.fr/players/' + BattleTag;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('not ok ' + response.statusText);
        }
        const data = await response.json();
        sessionStorage.setItem(BattleTag, JSON.stringify(data));
        document.getElementById('battletag').innerText = `BattleTag: ${BattleTag}`; // Update BattleTag tag
    } catch (error) {
        console.error(error, 'not ok');
    }
}

/**
 * Fetches stat summary information about a player.
 * @param {string} BattleTag - The BattleTag of the player.
 * @returns {Object|null} The player's stat summary or null if an error occurs.
 */
async function getPlayerStatsSummary(BattleTag) {
    var url = 'https://overfast-api.tekrop.fr/players/' + BattleTag + '/stats/summary';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('not ok ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error, 'not ok');
    }
}

/**
 * Fetches all information about all heroes.
 * @returns {Object|null} The hero data or null if an error occurs.
 */
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

/**
 * Adds a selected player's data to the chart and updates the display.
 * This is the is the main function to look at when tying together the graphs and the data from fetch requests
 */
async function addPlayerData() {
    const battleTagInput = document.getElementById('battleTagInput').value;
    if (battleTagInput != selectedPlayer) {
        selectedPlayer = battleTagInput;
        if (selectedPlayer in getPlayersFromSession()) {
            player_summary = getPlayerFromSession(selectedPlayer);
            console.log('Variables Update FROM SESSION FORMAT\nname:', selectedPlayer, 'summary:', player_summary);
        } else {
            player_summary = await getPlayerStatsSummary(selectedPlayer);
            if (!player_summary) {
                alert('Player not found or does not exists\nThis could be due to the account being private or not existing\nIf you believe this is an error this input will not be accepted until your session storage is clear (close your browser and try again)');
                console.log('player summary is null, data stored to prevent future requests');
                return; // NULL value supplied to data, stops from breaking the program
            }
            addPlayerToSession(selectedPlayer, player_summary);
            console.log('Variables Update FROM FETCH\nname:', selectedPlayer, 'summary:', player_summary);
        }
        document.getElementById('battletag').innerText = `BattleTag: ${selectedPlayer}`; // Update the BattleTag display
    }
    if (!player_summary) {
        alert('Further input of this username is not accepted to reduce invalid requests\nIf you believe this is an error this input will not be accepted until your session storage is clear (close your browser and try again)');
        console.log('forbidden battletag');
        return; // NULL value supplied to data, stops from breaking the program
    }
    updateChart();
    updateStatChart();
    updateHeroStatChart();
}
/*  ################################# Non async and No direct API calls ####################################### */

/* ################################# MISC ####################################### */

/**
 * Iterates through a JSON object and logs hero names and roles.
 * @param {Object} jsonData - The JSON object containing hero data.
 */
function iterateStorage(jsonData) {
    for (const hero of jsonData) {
        console.log(`Name: ${hero.name}, Role: ${hero.role}`);
    }    
}

/**
 * Displays stats for the currently selected hero and player.
 */
function displayStats() {
    const heroName = document.getElementById("heroDropdown").value;
    const statsContainer = document.getElementById("stats-container");
    statsData = player_summary;
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

/* ################################# Graphing ####################################### */

/**
 * Clears all data and labels from a given chart.
 * @param {Object} chart - The Chart.js chart instance to clear.
 */
function clearChart(chart) {
    chart.data.labels = []; // Clear labels
    chart.data.datasets.forEach((dataset) => {
        dataset.data = []; // Clear data
    });
    chart.update(); // Update the chart to apply changes
}

/* ################################# Chart 1 ####################################### */
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

/**
 * Updates the player chart with selected hero and stat data.
 */
async function updateChart() {

    data = player_summary;
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
            playerValue = value;
            playerChart.data.labels.push(key); // graph label
        }
    }

    for (const [key, value] of Object.entries(playerValue)) {
        if (key === document.getElementById('statDropdown').value) {
            playerValue = value;
        }
    }
    
    playerChart.data.datasets[0].data.push(playerValue); //graph data
    playerChart.update();
}

/**
 * Populates a dropdown menu with hero names.
 * @param {string} elementId - The ID of the dropdown element.
 */
async function populateDropdown(elementId) {
    const dropdown = document.getElementById(elementId);
    heroes = hero_stats;
    heroes.forEach(hero => {
        const option = document.createElement("option");
        option.value = hero.key; // Use the key as the value
        option.textContent = hero.name; // Display name in dropdown
        dropdown.appendChild(option);
    });
}

/**
 * Populates a dropdown menu with available stats.
 * @param {string} elementId - The ID of the dropdown element.
 */
async function populateStatDropdown(elementId) { 
    const dropdown = document.getElementById(elementId);
    stat = player_summary; // needs to be async so that we can await here
    for (const [key] of Object.entries(stat.general)) {
        const option = document.createElement("option");
        option.value = key; // Use the key as the value
        option.textContent = key; // Display name in dropdown
        dropdown.appendChild(option);
    }
}

/**
 * Retrieves stats for a specific hero for the selected player.
 * @param {string} heroName - The name of the hero.
 * @returns {Object|string} The hero's stats or a "Hero not found" message.
 */
async function getHeroStats(heroName) {
    statsData = player_summary;
    if (statsData.heroes[heroName]) {
        return statsData.heroes[heroName];
    } else {
        return "Hero not found";
    }
}

/**
 * Saves data to a JSON format and displays it in a designated element.
 * @param {Object} data - The data to save.
 */
function saveData(data) {
    document.getElementById('write').innerText = JSON.stringify(data, null, 2);
}

/**
 * Populates datalist on text input with BattleTags from stored in session storage.
 */
function populateBattleTagList() {
    JSON.parse(sessionStorage.getItem('playerNames')).forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        document.getElementById('battleTagList').appendChild(option);
    });
}

/* ################################# Chart 2 ####################################### */

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

/**
 * Updates the stat chart with data for all heroes.
 */
function updateStatChart() { /* call is nested inside call to other chart to reduce api calls */
    data = player_summary;
    var playerValue = data.heroes;

    clearChart(statChart);

    for (const [key, value] of Object.entries(playerValue)) {
        playerValue = value;
        statChart.data.labels.push(key); // graph label
        for (const [key, value] of Object.entries(playerValue)) {
            if (key === document.getElementById('statDropdown').value) {
                statChart.data.datasets[0].data.push(value); //graph data
                statChart.options.plugins.title.text = key;

                statChart.update();
            }
            
        }
    }
}

/* ################################# Chart 3 ####################################### */

/* graph of all stats per hero selection */
/* The graph */
const ctx3 = document.getElementById('heroStatChart').getContext('2d');
const heroStatChart = new Chart(ctx3, {
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
                text: 'Hero Stat Chart', // Set the title text
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
                heroStatChart.data.labels.splice(index, 1);
                heroStatChart.data.datasets[0].data.splice(index, 1);
                heroStatChart.update();
            }
        }
    }
});

/**
 * Updates the hero stat chart with data for the selected hero.
 */
function updateHeroStatChart() { /* call is nested inside call to other chart to reduce api calls */
    data = player_summary;
    var playerValue = data.heroes;

    clearChart(heroStatChart);


    for (const [key, value] of Object.entries(playerValue)) {
        if (key === document.getElementById('heroDropdown').value) {
            playerValue = value;
            heroStatChart.options.plugins.title.text = key;
        }
    }

    for (const [key, value] of Object.entries(playerValue)) {
        if (key == 'time_played') {
            break;
        }
        heroStatChart.data.datasets[0].data.push(value); //graph data
        heroStatChart.data.labels.push(key); // graph label
        heroStatChart.update();
    }
}

/* test */

//getPlayer('NightTrain-11944'); /* depreciated for now gives too much data */ 
//addPlayerData('NightTrain-11944'); /* currently in use gives a managable amount of data */