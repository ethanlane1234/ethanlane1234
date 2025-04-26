/*  Developed by Ethan Lane
    Stated: 3/17/25
    sources: uses the publicly avaible, overfast api
    If the api is down the code goes to "fall back mode" and a speacial interface has users manually enter data
*/                                                             
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

/* ################################# API functions ###################################### */

/**
 * Main asynchronous function to initialize data and populate dropdowns.
 * Fetches hero stats and player summaries if not already stored.
 */
async function ASYNC_main() { // these variables/functions need to use the await keyword
    if (sessionStorage.getItem('isInFallBackMode')){console.log('fallback moode');setFallBackUI();return;} // check if in fall back mode after page reloads
    if (!hero_stats){hero_stats = await getHeroes();console.log('fetching hero names');}
    if (!player_summary){player_summary = await getPlayerStatsSummary(selectedPlayer);console.log('fetching player summary');}
    if (fallback) {return;} // stop when player bad
    await populateDropdown('heroDropdown');
    await populateStatDropdown('statDropdown');

    addPlayerToSession(selectedPlayer, player_summary);
    sessionStorage.setItem('heroes', JSON.stringify(hero_stats));
    
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
        if (BattleTag !== default_profile) {
            console.error(error, 'not ok');
            return;
        }

        // If the default profile fails than we likely cannt rely on the API to get anything a fallback system takes over for complete manual input of data
        fallback = true;
        sessionStorage.setItem('isInFallBackMode', true);
        setFallBackUI();
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
    const statsinfo = document.getElementById("stats-container");
    statsData = player_summary;
    if (heroName && statsData.heroes[heroName]) {
        const stats = statsData.heroes[heroName];
        let statsHtml = `<h2>${heroName.charAt(0).toUpperCase() + heroName.slice(1)}'s Stats</h2>`;
        for (const [key, value] of Object.entries(stats)) {
            statsHtml += `<p><strong>${key}:</strong> ${value}</p>`;
        }
        statsinfo.innerHTML = statsHtml;
    } else {
        statsinfo.innerHTML = `<h2>Stats</h2><p>Select a hero to see their stats.</p>`;
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
    document.getElementById('output').innerText = JSON.stringify(data, null, 2);
}

/**
 * Populates datalist on text input with BattleTags from stored in session storage.
 */
function populateBattleTagList() {
    if (sessionStorage.getItem('playerNames')) { // dont let empty session storage cause problems
        JSON.parse(sessionStorage.getItem('playerNames')).forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            document.getElementById('battleTagList').appendChild(option);
        });
    }
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

/* ################################# Update Graphs ####################################### */

/**
 * Adds a selected player's data to the chart and updates the display.
 * This is the is the main function to look at when tying together the graphs and the data from fetch requests
 */
async function addPlayerData() {
    const battleTagInput = document.getElementById('battleTagInput').value;
    if (!sessionStorage.getItem('isInFallBackMode')) {
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
    } else {
        console.log('updating from fallback mode');
    }
    updateChart();
    updateStatChart();
    updateHeroStatChart();
}

/* ############################### Variables ######################################## */

/* Gobal Variables */
//var selectedPlayer = 'NightTrain-11944'; old default profile, is not found since new update to game

// 'https://ow-api.com/v1/stats/pc/us/TeKrop-2217/profile' new api
const default_profile = 'TeKrop-2217'
var selectedPlayer = default_profile;
var hero_stats = getHeroesFromSession();
var player_summary = getPlayerFromSession(selectedPlayer);
var mode = null;
var fallback = false;

/* ############################### FallBack System ######################################## */


let players = {};
/**
 * Manages formatting user input from the fallback UI to be used by the rest of the logic
 */
function addStat() {
    const nameInput = document.getElementById('playerName');
    const statInput = document.getElementById('statSelect');
    const valueInput = document.getElementById('statValue');
    const heroInput = document.getElementById('heroName');

    const playerName = nameInput.value.trim();
    const stat = statInput.value;
    const value = Number(valueInput.value);
    const hero = heroInput.value;
    
    // new player
    if (!players[playerName]) {
        players[playerName] = {
            "general": {
                "games_lost": 0,
                "games_played": 0,
                "games_won": 0,
                "kda": 0,
                "time_played": 0,
                "winrate": 0
                },
            "heroes":{},
            "roles":{}
        }
    }

    // new hero
    if (!players[playerName].heroes[hero]) {
        players[playerName].heroes[hero] = {};
    }

    // update hero values
    players[playerName].heroes[hero][stat] = value;
    players[playerName].heroes[hero].name = hero;
    
    // Display updated JSON and update player summary
    player_summary = players[playerName];
    addPlayerToSession(selectedPlayer, JSON.stringify(players, null, 2)); // updates player summary in session storage
    document.getElementById('output').textContent = JSON.stringify(players, null, 2);
    

    // update dropdown menus
    hero_stats = player_summary.heroes;
    let temp = [];
    for (const [key, value] of Object.entries(hero_stats)) {
        temp.push({ key: key, name: key }); // combine key and name into one object
    }
    hero_stats = temp;

    // adds heroes to session storage since that step is bypassed in the mode this function gets called
    sessionStorage.setItem('heroes', JSON.stringify(hero_stats));

    // set up dropdown boxes for loading manual data
    document.getElementById('heroDropdown').innerHTML = '<option value="">-- Select a Hero --</option>';
    document.getElementById('statDropdown').innerHTML = '<option value="">-- Select a Stat --</option>';
    populateDropdown('heroDropdown');
    populateStatDropdown('statDropdown');
}

/**
 * Creates a UI for manual data input.
 * To be used when API collection of data fails.
 */
function setFallBackUI() {
    // graph settings
    selectedPlayer = "Offline-Mode";
    players = JSON.parse(getPlayerFromSession('Offline-Mode'));
    if (!players){players={};} // if that last line returns null this fixes it

    const info = document.getElementById("info");

    // delete and modify existing UI
    document.getElementById('battletag').innerHTML = 'Offline Mode';
    document.getElementById('battleTagInput').outerHTML = ``;
    document.getElementById('heroLabel').style.display = '';
    document.getElementById('statLabel').style.display = '';
    //document.getElementById('addData').outerHTML = '';
    document.getElementById('')

    // change styling to work with new UI                        
    info.style.columnCount = 1; // changes styling to work for fallback system  


    // creates input for player name
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Player Name:";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.text = "Default";
    nameInput.id = "playerName";
    nameInput.placeholder = "Enter Player Name";

    // Adds a hero name input
    const heroLabel = document.createElement("label");
    heroLabel.textContent = "Hero Name:";
    const heroName = document.createElement("input");
    heroName.type = "text";
    heroName.id = 'heroName';
    heroName.placeholder = 'Enter Hero Name';

    // creates a dropdrop of stats
    const statLabel = document.createElement("label");
    statLabel.textContent = "Stat:";
    const statSelect = document.createElement("select");
    statSelect.id = "statSelect";

    const stats = ["games_lost", "games_played", "games_won", "kda", "time_played", "winrate"];
    stats.forEach(stat => {
        const option = document.createElement("option");
        option.value = stat;
        option.textContent = stat;
        statSelect.appendChild(option);
    });

    // creates feilds to input values
    const valueLabel = document.createElement("label");
    valueLabel.textContent = "Value:";
    const valueInput = document.createElement("input");
    valueInput.type = "number";
    valueInput.id = "statValue";
    valueInput.placeholder = "Enter Stat Amount";


    // Adds a button to add stats
    const button = document.createElement("button");
    button.textContent = "Add Stat";
    button.onclick = addStat;

    // create explanation for constructed data section
    const explain = document.createElement("h2");
    explain.innerHTML = "The Data Below Can Be Output From The Interface Above Or Manually Written Below";

    // create a element to output user input convert to JSON data into
    const output = document.createElement("pre");
    output.id = "output";
    output.contentEditable = true;
    output.spellcheck = false;

    const directions = document.createElement("h2")
    directions.innerHTML = "Entering information below with unlock and add values to the selection boxes above."
    
    // append into html
    info.appendChild(directions)
    info.appendChild(nameLabel);
    info.appendChild(nameInput);
    info.appendChild(document.createElement("br"));
    info.appendChild(heroLabel);
    info.appendChild(heroName);

    info.appendChild(statLabel);
    info.appendChild(statSelect);
    info.appendChild(document.createElement("br"));

    info.appendChild(valueLabel);
    info.appendChild(valueInput);
    info.appendChild(document.createElement("br"));
    info.appendChild(document.createElement("br"));

    info.appendChild(button);
    info.appendChild(explain);
    info.appendChild(document.createElement("h3")).textContent = "Currently Constructed Data:";
    info.appendChild(output);
    addStat();
    document.getElementById(output.id).addEventListener('keydown', setPlayerToOutput);
    document.getElementById(output.id).addEventListener('keyup', setPlayerToOutput);
}

function setPlayerToOutput() {
    output = document.getElementById('output');
    try {
        players = JSON.parse(output.textContent);
        addPlayerToSession('Offline Mode', JSON.stringify(players), null, 2);
        output.style.backgroundColor = 'rgb(62, 192, 73)';
    } catch (error) {
        output.style.backgroundColor = '#c20f0f';
    }
}

/* ############################### MAIN ######################################## */

/* Main */
document.getElementById('heroLabel').style.display = 'none';
document.getElementById('statLabel').style.display = 'none';
ASYNC_main();
document.addEventListener('DOMContentLoaded', populateBattleTagList());