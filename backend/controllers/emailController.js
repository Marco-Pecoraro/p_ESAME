// backend/controllers/emailController.js
import EmailService from '../services/emailService.js';

const emailService = new EmailService();

const getEmails = async (req, res) => {
    try {
        const emails = await emailService.getEmails();
        res.status(200).json({
            status: 'success',
            data: emails,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};

const syncEmails = async (req, res) => {
    try {
        const result = await emailService.syncEmails();
        res.status(200).json({
            status: 'success',
            count: result.count,
            newEmails: result.newEmails,
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};

// Esporta l'intero controller come un oggetto
export default { getEmails, syncEmails };
