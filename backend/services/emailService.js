import { google } from 'googleapis';
import dotenv from 'dotenv';
import MongoDB from './mongodb.js';

dotenv.config();

class EmailService {
    constructor() {
        const mongoDB = new MongoDB();
        this.db = mongoDB.getDb();
    }

    async getEmails() {
        const emails = await this.db.collection('emails').find({}).sort({ date: -1 }).limit(50).toArray();
        return emails;
    }

    async syncEmails() {
        const oAuth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            'http://localhost:8888/oauth2callback'
        );

        // Usa i token ottenuti durante l'autenticazione
        oAuth2Client.setCredentials({
            access_token: process.env.GMAIL_ACCESS_TOKEN,
            refresh_token: process.env.GMAIL_REFRESH_TOKEN,
        });

        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        const res = await gmail.users.messages.list({
            userId: 'me',
            q: 'is:unread', // Ottieni le email non lette
        });

        const newEmails = res.data.messages || [];
        const emailCount = newEmails.length;

        for (const message of newEmails) {
            const messageData = await gmail.users.messages.get({
                userId: 'me',
                id: message.id,
            });

            const email = messageData.data;
            const emailDetails = {
                subject: email.payload.headers.find(header => header.name === 'Subject').value,
                from: email.payload.headers.find(header => header.name === 'From').value,
                date: email.payload.headers.find(header => header.name === 'Date').value,
                body: email.snippet,
            };

            await this.db.collection('emails').insertOne(emailDetails);
        }

        return { count: emailCount, newEmails: newEmails };
    }
}

export default EmailService;
