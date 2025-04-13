// backend/services/mongodb.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

class MongoDB {
    constructor() {
        // Crea una connessione al client MongoDB
        this.client = new MongoClient(process.env.MONGO_URI);
        this.db = this.client.db(process.env.DB_NAME);
    }

    // Restituisce il database
    getDb() {
        return this.db;
    }
}

export default MongoDB;
