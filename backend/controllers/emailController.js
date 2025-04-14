import EmailService from '../services/emailService.js';

const emailService = new EmailService();

const getEmails = async (req, res) => {
    try {
        const emails = await emailService.getEmails();
        res.status(200).json(emails);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const syncEmails = async (req, res) => {
    try {
        const result = await emailService.syncEmails();
        res.status(200).json({ status: 'success', count: result.count });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export default { getEmails, syncEmails };
