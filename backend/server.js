// backend/server.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // per abilitare CORS
import EmailService from './services/emailService.js'; // Assicurati che l'importazione sia corretta

dotenv.config();

const app = express();
const emailService = new EmailService(); // Crea un'istanza del servizio email

app.use(cors()); // Abilita CORS
app.use(express.json());

// Definisci la route per ottenere le email
app.get('/emails', async (req, res) => {
    try {
        const emails = await emailService.getEmails();  // Ottieni le email dal servizio
        res.status(200).json({
            status: "success",
            data: emails
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
});

// Avvia il server
const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});
