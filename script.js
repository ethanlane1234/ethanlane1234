/* developed by Ethan Lane 
    started: 3/21/25
    this file is a lighter weight than the tracking scripts, which dont need to be loaded on every page. However to run on the tracking pages, it is better to merge the files together than load both seperately.
*/

/* merged with script_ow.js 4/1/23 */

/**
 * Retrieves all players and their data from sessionStorage.
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
 * Retrieves a specific player's data from sessionStorage.
 * @param {string} selectedPlayer - The name of the player to retrieve.
 * @returns {Object|null} The player's data as an object, or null if not found.
 */
function getPlayerFromSession(selectedPlayer) {
    return JSON.parse(sessionStorage.getItem(selectedPlayer));
}

/**
 * Adds a player and their data to sessionStorage.
 * @param {string} playerName - The name of the player to add.
 * @param {Object} playerData - The data of the player to store.
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
 * Retrieves the list of heroes from sessionStorage.
 * @returns {Array|null} An array of heroes, or null if not found.
 */
function getHeroesFromSession() {
    return JSON.parse(sessionStorage.getItem('heroes'));
}

/* #################################### writes json to html in readable format ######################################### */

/* these functions are not merged with tracking sripts */

/**
 * Displays session data in a readable JSON format inside a given HTML element.
 * @param {HTMLElement} element - The HTML element where the session data will be displayed.
 */
function displaySessionIntoHTML(element) {    
    if (element) {
        element.innerHTML = '';
        element.appendChild(document.createElement('pre').appendChild(renderJSON(getSessionData())));
    }
}

/**
 * Retrieves all session data from sessionStorage.
 * @returns {Object} An object containing all session keys and their corresponding data.
 */
function getSessionData() {
    const sessionData = {};
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        try {
            sessionData[key] = JSON.parse(sessionStorage.getItem(key));
        } catch {
            sessionData[key] = sessionStorage.getItem(key); // not a json
        }
    }
    return sessionData;
}

/**
 * Recursively renders a JSON object into a collapsible HTML structure.
 * @param {Object} json - The JSON object to render.
 * @param {number} [level=0] - The current depth level for indentation.
 * @returns {HTMLElement} A DOM element representing the rendered JSON.
 */
function renderJSON(json, level = 0) {
    const container = document.createElement('div');
    container.style.marginLeft = `${level * 20}px`;

    if (typeof json === 'object' && json !== null) {
        for (const key in json) {
            const keyElement = document.createElement('div');
            const value = json[key];

            if (typeof value === 'object' && value !== null) {
                const toggle = document.createElement('span');
                toggle.textContent = '[+] ';
                toggle.style.cursor = 'pointer';

                const keyLabel = document.createElement('span');
                keyLabel.textContent = key;

                const childContainer = renderJSON(value, level + 1);
                childContainer.style.display = 'none';

                toggle.addEventListener('click', () => {
                    if (childContainer.style.display === 'none') {
                        childContainer.style.display = 'block';
                        toggle.textContent = '[-] ';
                    } else {
                        childContainer.style.display = 'none';
                        toggle.textContent = '[+] ';
                    }
                });

                keyElement.appendChild(toggle);
                keyElement.appendChild(keyLabel);
                keyElement.appendChild(childContainer);
            } else {
                keyElement.textContent = `${key}: ${JSON.stringify(value)}`;
            }

            container.appendChild(keyElement);
        }
    } else {
        container.textContent = JSON.stringify(json);
    }
    if (container.innerHTML === '') {
        return document.createTextNode('No data available');
    }
    return container;
}