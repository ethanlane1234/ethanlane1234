# Hero Shooter Strategies, Guides, and Tracking

## About

This website provides tools and information, primarily in the form of player stats and strategies, for the video games Overwatch 2 and Marvel Rivals.

## Copyright

To avoid copyright issues, as Overwatch and Marvel Rivals are copyrighted games, this page contains no copyrighted images or assets from the games.  
This website uses public APIs:
- [Overfast API](https://overfast-api.tekrop.fr/) for Overwatch 2 data.
- [Marvel Rivals API](https://mrapi.org/) for Marvel Rivals data (planned for future use).

**Note:** All pictures used in this project are self-made.

## Pages

### `index.html`

The index page serves as the homepage for the Overwatch Tracker website. It provides navigation to other sections of the site.

### `about.html`

The about page explains the purpose of the website, provides information about data sources, and includes disclaimers about copyright. It contains links to the APIs and official sites:
- [Overfast API](https://overfast-api.tekrop.fr/)
- [Overwatch Heroes](https://overwatch.blizzard.com/en-us/heroes/)

### `ow_tracker.html`

The OW Tracker page allows users to enter a BattleTag and view player statistics. Users can select a hero and a stat to display specific data on a chart.

### `mr_tracker.html`

The MR Tracker page is intended for tracking Marvel Rivals player data. It includes input fields for BattleTags and displays hero stats and charts.

### `guide.html`

The guide page provides strategies and guides for both Overwatch 2 and Marvel Rivals. It includes sections for team compositions (e.g., Dive, Poke, Brawl) and hero-specific guides.  
A **Summary of Differences** section highlights how the strategies differ between the two games.

## CSS Files

### `style.css`

This file contains the primary styling for the website, including layout, colors, and responsiveness for larger screens.  

**Main Features:**
- Defines the overall layout and structure of the website.
- Includes styles for headers, navigation bars, and content sections.
- Provides styling for charts, dropdowns, and buttons.
- Implements a two-column layout for the `.main` class on larger screens.

### `style_mobile.css`

This file provides additional styling for mobile devices and smaller screens.  

**Main Features:**
- Adjusts font sizes, margins, and paddings for better readability on smaller screens.
- Converts the `.main` layout to a single-column format for mobile devices.
- Ensures elements like navigation bars and charts are responsive and fit within smaller viewports.
- Includes media queries to apply styles specifically for devices with a maximum width of 768px.

## JavaScript Files

### `script.js`

This file contains utility functions for managing session storage and retrieving player and hero data.

#### Functions:
- `getPlayersFromSession()`: Retrieves all players stored in session storage.
- `getPlayerFromSession(selectedPlayer)`: Retrieves a specific player's data from session storage.
- `addPlayerToSession(playerName, playerData)`: Adds a player's data to session storage.
- `getHeroesFromSession()`: Retrieves hero data from session storage.

### `tracking/script_ow.js`

This file contains functions to interact with the Overfast API and update Overwatch 2 player statistics.

#### Functions:
- `getPlayer(BattleTag)`: Fetches player data for the given BattleTag.
- `getPlayerStatsSummary(BattleTag)`: Fetches a summary of player statistics for the given BattleTag.
- `getHeroes()`: Fetches a list of all heroes.
- `addPlayerData()`: Adds player data to the chart.
- `updateChart()`: Updates the chart with the selected player's statistics.
- `populateDropdown(elementId)`: Populates a dropdown menu with hero names.
- `populateStatDropdown(elementId)`: Populates a dropdown menu with player statistics.
- `displayStats()`: Displays statistics for the selected hero.

### `tracking/script_mr.js`

This file contains functions to interact with the Marvel Rivals API.

#### Functions:
- `getAccessToken()`: Retrieves an access token for API authentication.
- `getProfile(battletag)`: Fetches player profile data for the given BattleTag.

## Dependencies

- **Chart.js**: Used for rendering player statistics charts.
- **Fetch API**: Used for making HTTP requests to the Overfast and Marvel Rivals APIs.

## Setup

1. Include the Chart.js library in your HTML files.
2. Ensure you have HTML elements with the appropriate IDs for charts, dropdowns, and stats containers.
3. Configure API endpoints and access tokens as needed.

## Notes

- The `sessionStorage` is used to cache API responses for faster access.
- The `selectedPlayer` variable is used to keep track of the currently selected player.

## Known Issues

- **Issue**: Opening dev tools breaks the JS on the `ow_tracker.html` page (discovered 4/12/2025).  
  **Potential Solution**:
  - Remove `async` from the `<script>` tag in the HTML.
  - Alternatively, move items that need to wait for the DOM into event listeners.

## Goal

Create a comprehensive website for helpful strategies, guides, and tracking tools for different hero shooter games.

## Contributors

This page was fully developed by Ethan Lane.
