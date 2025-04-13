import { google } from 'googleapis';
import dotenv from 'dotenv';
import express from 'express';
import open from 'open';

dotenv.config();

// Crea l'istanza di Express
const app = express();

// Crea l'istanza OAuth2 client di Google
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID, // Client ID
    process.env.CLIENT_SECRET, // Client Secret
    'http://localhost:8888/oauth2callback' // Redirect URI
);

const scopes = ['https://www.googleapis.com/auth/gmail.readonly']; // Permessi per leggere le email

// Step 1: Redirect a Google per ottenere autorizzazione
app.get('/auth', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline', // Necessario per ottenere anche il refresh_token
        scope: scopes,
    });
    res.redirect(authUrl); // Redirige l'utente alla pagina di autorizzazione
});

// Step 2: Google reindirizza a questo endpoint dopo l'autorizzazione
app.get('/oauth2callback', async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Salva i token, come access token e refresh token, per un uso futuro
        res.json({ access_token: tokens.access_token, refresh_token: tokens.refresh_token });
    } catch (error) {
        res.status(500).json({ message: 'Errore durante il recupero del token', error });
    }
});

// Step 3: Esegui il server
app.listen(8888, () => {
    console.log('Server in esecuzione su http://localhost:8888');
});
