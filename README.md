# OverwatchTracker

## About

This website provides information, mostly in the form of player stats, for the video game Overwatch 2.

## Copyright

To avoid copyright issues as Overwatch is a copyrighted game, this page contains no copyrighted images and such from the game.
This website also uses a public API called Overfast API:
- [Overfast API](https://overfast-api.tekrop.fr/)

## Pages

### index.html

The index page serves as the homepage for the Overwatch Tracker website.

### about.html

The about page explains the purpose of the website, as well as providing information about where the data was sourced, and disclaimers about copyright since Overwatch 2 is a copyrighted game.
This page contains links to the API as well as the official site that the API sources its data from:
- [Overfast API](https://overfast-api.tekrop.fr/)
- [Overwatch Heroes](https://overwatch.blizzard.com/en-us/heroes/)

### ow_tracker.html

The OW Tracker page allows users to enter a BattleTag and view player statistics. Users can select a hero and a stat to display specific data on a chart.

### mr_tracker.html

The MR Tracker page is intended for tracking match results or other related data.

### style.css

The CSS file contains styling for the entire website, including layout, colors, and responsiveness.

### randomApiOnInternet.js

This JavaScript file contains functions to interact with the Overfast API and update the player statistics chart.

#### Functions

- `getPlayer(BattleTag)`: Fetches player data for the given BattleTag and updates the chart.
- `getPlayerStatsSummary(BattleTag)`: Fetches a summary of player statistics for the given BattleTag.
- `getHeroes()`: Fetches a list of all heroes.
- `iterateStorage(jsonData)`: Logs hero names and roles from the provided JSON data.
- `addPlayerData()`: Adds player data to the chart.
- `updateChart()`: Updates the chart with the selected player's statistics.
- `populateDropdown(elementId)`: Populates a dropdown menu with hero names.
- `populateStatDropdown(elementId)`: Populates a dropdown menu with player statistics.
- `getHeroStats(heroName)`: Fetches statistics for the specified hero.
- `displayStats()`: Displays statistics for the selected hero.
- `saveData(data)`: Saves data to a DOM element for display.

#### Usage

1. **Populate Dropdowns**: The `populateDropdown` and `populateStatDropdown` functions are called to populate the hero and stat dropdown menus.
2. **Display Stats**: The `displayStats` function is used to display the selected hero's statistics.
3. **Update Chart**: The `updateChart` function updates the chart with the selected player's statistics.
4. **Add Player Data**: The `addPlayerData` function is used to add player data to the chart.

#### Example

To fetch and display player data for a specific BattleTag:

```javascript
getPlayer('NightTrain-11944');
```

To update the chart with the selected player's statistics:

```javascript
updateChart();
```

To display statistics for the selected hero:

```javascript
displayStats();
```

## Dependencies

- Chart.js: Used for rendering the player statistics chart.
- Fetch API: Used for making HTTP requests to the Overfast API.

## Setup

1. Include the Chart.js library in your HTML file.
2. Ensure you have an HTML element with the ID `playerChart` for the chart.
3. Ensure you have dropdown elements with the IDs `heroDropdown` and `statDropdown` for selecting heroes and stats.
4. Ensure you have a container element with the ID `stats-container` for displaying hero stats.

## Notes

- The `selectedPlayer` variable is used to keep track of the currently selected player.
- The `sessionStorage` is used to cache API responses for faster access.

## Goal

This website is part of a final project for the class Principles of Software Development (CMSCI 256) at Mount St. Mary's University.

## Contributors

This page was fully developed by Ethan Lane.