const API_KEY = 'AIzaSyCXkwcQsZ2_5nQFjiQJnUb4GQl_hzlQ-Xk';
const CLIENT_ID = '1060133637484-6o6j9sthc46vik1p1ishgqlj369efcar.apps.googleusercontent.com';
const DISCOVERY_DOC = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

function gapiLoaded() {
    gapi.load('client', async () => {
        await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: DISCOVERY_DOC,
        });
        gapiInited = true;
        maybeEnableButtons();
    });
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (tokenResponse) => {
            sessionStorage.setItem("gt", tokenResponse.access_token);
        }
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById("authorize-button").disabled = false;
    }
}

document.getElementById("authorize-button").onclick = () => {
    const token = sessionStorage.getItem("gt");
    if (!token) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        gapi.client.setToken({ access_token: token });
        tokenClient.requestAccessToken({ prompt: '' });
    }
};

document.getElementById("sync-button").onclick = async () => {
    const token = sessionStorage.getItem("gt");
    if (!token) return alert("Autenticati prima");
    await fetch("http://localhost:8888/api/emails/sync", { method: "POST" });
    await loadEmailsToPage();
};

async function loadEmailsToPage() {
    try {
        const res = await fetch("http://localhost:8888/api/emails");
        const json = await res.json();
        const emails = json.data;
        const list = document.getElementById("emails-container");
        list.innerHTML = "";
        emails.forEach(email => {
            const item = document.createElement("div");
            item.classList.add("email-item");
            item.innerHTML = `
                <h3>${email.subject || '(senza oggetto)'}</h3>
                <p><strong>Da:</strong> ${email.from}</p>
                <p><strong>Data:</strong> ${email.date}</p>
                <p>${email.body}</p>
                <hr/>
            `;
            list.appendChild(item);
        });
    } catch (err) {
        console.error("Errore nel caricamento email:", err);
    }
}
