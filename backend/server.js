import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import emailController from './controllers/emailController.js';

dotenv.config();

const app = express();

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});


app.use(cors());
app.use(express.json());

// Path assoluto alla root del progetto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, '../frontend');

app.use(express.static(frontendPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('/api/emails', emailController.getEmails);
app.post('/api/emails/sync', emailController.syncEmails);

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});
