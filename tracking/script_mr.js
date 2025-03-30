/* Get Acess Token */

async function getAccessToken() {
    const clientId = "";
    const clientSecret = "";
    const tokenUrl = 'https://mrapi.org/api/player/example';

    const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
            "Authorization": "Basic " + btoa(`${clientId}:${clientSecret}`),
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials"
    });

    const data = await response.json();
    return data.access_token; // Returns the access token
}

async function getProfile(battletag) {
    const token = await getAccessToken(); // Get the token before making the request
    const apiUrl = 'https://mrapi.org/api/player/' + battletag;

    const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,  // Using the token here
        }
    });
    if (!response.ok) {
        console.error(response, response.statusText);
        return;
    }
    const data = await response.json();
    console.log(data);
}
