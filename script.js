/* developed by Ethan Lane 
    started: 3/21/25
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

function getPlayerFromSession(selectedPlayer) {
    return JSON.parse(sessionStorage.getItem(selectedPlayer));
}

function addPlayerToSession(playerName, playerData) {
    const playerNames = JSON.parse(sessionStorage.getItem('playerNames')) || [];
    if (!playerNames.includes(playerName)) {
        playerNames.push(playerName);
        sessionStorage.setItem('playerNames', JSON.stringify(playerNames));
    }
    sessionStorage.setItem(playerName, JSON.stringify(playerData));
}

function getHeroesFromSession() {
    return JSON.parse(sessionStorage.getItem('heroes'));
}