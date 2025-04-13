const API_KEY = 'AIzaSyCXkwcQsZ2_5nQFjiQJnUb4GQl_hzlQ-Xk';
const CLIENT_ID = '1060133637484-6o6j9sthc46vik1p1ishgqlj369efcar.apps.googleusercontent.com';
const DISCOVERY_DOC = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

// Init GAPI
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

// Init OAuth
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (tokenResponse) => {
            sessionStorage.setItem("gt", tokenResponse.access_token);
            await fetchEmailsAndSendToServer();
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

// Autenticazione
document.getElementById("authorize-button").onclick = () => {
    const token = sessionStorage.getItem("gt");
    if (!token) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        gapi.client.setToken({ access_token: token });
        tokenClient.requestAccessToken({ prompt: '' });
    }
};

// FETCH EMAILS & INVIA A SERVER
async function fetchEmailsAndSendToServer() {
    try {
        const res = await gapi.client.gmail.users.messages.list({
            userId: 'me',
            maxResults: 10,
        });

        const messages = res.result.messages || [];

        for (const msg of messages) {
            const detail = await gapi.client.gmail.users.messages.get({
                userId: 'me',
                id: msg.id,
            });

            const headers = detail.result.payload.headers;
            const subject = headers.find(h => h.name === "Subject")?.value || "";
            const from = headers.find(h => h.name === "From")?.value || "";
            const date = headers.find(h => h.name === "Date")?.value || "";
            const body = getBody(detail.result.payload);

            const emailData = {
                subject,
                from,
                date,
                body,
            };

            await fetch("http://localhost:8888/api/emails", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(emailData),
            });
        }

        alert("Email sincronizzate!");
    } catch (err) {
        console.error(err);
    }
}

function getBody(payload) {
    if (!payload.parts) {
        return atob(payload.body.data || "");
    }

    const part = payload.parts.find(p => p.mimeType === "text/plain");
    return atob(part?.body?.data || "");
}

// Carica email dal server e visualizza
async function loadEmailsToPage() {
    try {
        const res = await fetch("http://localhost:8888/api/emails");
        const emails = await res.json();

        const list = document.getElementById("email-list");
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
