/* developed by Ethan Lane 
    started: 3/21/25
    this file is a lighter weight than the tracking scripts, which dont need to be loaded on every page. However to run on the tracking pages, it is better to merge the files together than load both seperately.
*/

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
            if (key == {}) {
                break;
            }
            const keyElement = document.createElement('div');
            const value = json[key];

            if (typeof value === 'object' && value !== null) {
                const toggle = document.createElement('span');
                toggle.textContent = '[+] ';
                toggle.style.cursor = 'pointer';

                const keyLabel = document.createElement('span');
                keyLabel.textContent = key;
                
                const childContainer = renderJSON(value, level + 1);
                try {
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
                } catch (error) {
                    // do noting
                }

                
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