# OverwatchTracker

## About

This website provides tools and information, primarily in the form of player stats, for the video games Overwatch 2 and Marvel Rivals.

## Copyright

To avoid copyright issues, as Overwatch and Marvel Rivals are copyrighted games, this page contains no copyrighted images or assets from the games.
This website also uses public APIs:
- [Overfast API](https://overfast-api.tekrop.fr/) for Overwatch 2 data.
- [Marvel Rivals API](https://mrapi.org/) for Marvel Rivals data.

## Pages

### index.html

The index page serves as the homepage for the Overwatch Tracker website. It provides navigation to other sections of the site.

### about.html

The about page explains the purpose of the website, provides information about data sources, and includes disclaimers about copyright. It contains links to the APIs and official sites:
- [Overfast API](https://overfast-api.tekrop.fr/)
- [Overwatch Heroes](https://overwatch.blizzard.com/en-us/heroes/)

### ow_tracker.html

The OW Tracker page allows users to enter a BattleTag and view player statistics. Users can select a hero and a stat to display specific data on a chart.

### mr_tracker.html

The MR Tracker page is intended for tracking Marvel Rivals player data. It includes input fields for BattleTags and displays hero stats and charts.

### guide.html

The guide page provides strategies and guides for both Overwatch 2 and Marvel Rivals. It includes sections for strategies (e.g., Dive, Poke) and hero-specific guides.

### style.css

The CSS file contains styling for the entire website, including layout, colors, and responsiveness.

## JavaScript Files

### script.js

This file contains utility functions for managing session storage and retrieving player and hero data.

#### Functions

- `getPlayersFromSession()`: Retrieves all players stored in session storage.
- `getPlayerFromSession(selectedPlayer)`: Retrieves a specific player's data from session storage.
- `addPlayerToSession(playerName, playerData)`: Adds a player's data to session storage.
- `getHeroesFromSession()`: Retrieves hero data from session storage.

### tracking/script_ow.js

This file contains functions to interact with the Overfast API and update Overwatch 2 player statistics.

#### Functions

- `getPlayer(BattleTag)`: Fetches player data for the given BattleTag.
- `getPlayerStatsSummary(BattleTag)`: Fetches a summary of player statistics for the given BattleTag.
- `getHeroes()`: Fetches a list of all heroes.
- `addPlayerData()`: Adds player data to the chart.
- `updateChart()`: Updates the chart with the selected player's statistics.
- `populateDropdown(elementId)`: Populates a dropdown menu with hero names.
- `populateStatDropdown(elementId)`: Populates a dropdown menu with player statistics.
- `displayStats()`: Displays statistics for the selected hero.

### tracking/script_mr.js

This file contains functions to interact with the Marvel Rivals API.

#### Functions

- `getAccessToken()`: Retrieves an access token for API authentication.
- `getProfile(battletag)`: Fetches player profile data for the given BattleTag.

### generator/generator.js

This file generates random BattleTags and validates them using the Overfast API.

#### Functions

- `fetchKnownUsernames()`: Fetches a list of known usernames from a local JSON file.
- `generateBattleTag(username)`: Generates a random BattleTag for a given username.
- `checkValidBattleTag(battleTag)`: Checks if a BattleTag is valid using the Overfast API.
- `findValidBattleTag()`: Attempts to find a valid BattleTag by iterating through known usernames.

## Dependencies

- Chart.js: Used for rendering player statistics charts.
- Fetch API: Used for making HTTP requests to the Overfast and Marvel Rivals APIs.

## Setup

1. Include the Chart.js library in your HTML files.
2. Ensure you have HTML elements with the appropriate IDs for charts, dropdowns, and stats containers.
3. Configure API endpoints and access tokens as needed.

## Notes

- The `sessionStorage` is used to cache API responses for faster access.
- The `selectedPlayer` variable is used to keep track of the currently selected player.

## Goal

This website is part of a final project for the class Principles of Software Development (CMSCI 256) at Mount St. Mary's University.

## Contributors

This page was fully developed by Ethan Lane.