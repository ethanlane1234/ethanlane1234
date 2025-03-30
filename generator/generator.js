async function fetchKnownUsernames() {
    try {
        const response = await fetch('players.json'); // Load local JSON file
        if (!response.ok) throw new Error('Failed to load players.json');
        const data = await response.json();
        return data.players.map(player => player.username); // Adjust based on actual file structure
    } catch (error) {
        console.error('Error fetching known usernames:', error);
        return [];
    }
}

function generateBattleTag(username) {
    const numbers = Math.floor(Math.random() * 9000) + 1000; // 4-digit number
    return `${username}#${numbers}`;
}

async function checkValidBattleTag(battleTag) {
    const url = `https://overfast-api.tekrop.fr/players/${battleTag.replace('#', '-')}`;
    try {
        const response = await fetch(url);
        return response.ok;
    } catch (error) {
        console.error("Error checking BattleTag:", error);
        return false;
    }
}

async function findValidBattleTag() {
    const knownUsernames = await fetchKnownUsernames();
    let attempts = 0;
    for (const username of knownUsernames) {
        const battleTag = generateBattleTag(username);
        const isValid = await checkValidBattleTag(battleTag);
        attempts++;
        if (isValid) {
            console.log(`Valid BattleTag found after ${attempts} attempts:`, battleTag);
            return battleTag;
        }
        if (attempts % 100 === 0) {
            console.log("Rate limit reached. Waiting 60 seconds...");
            await new Promise(resolve => setTimeout(resolve, 60000));
        }
    }
    console.log("No valid BattleTag found.");
    return null;
}

// Uncomment to start finding a valid BattleTag
findValidBattleTag();
