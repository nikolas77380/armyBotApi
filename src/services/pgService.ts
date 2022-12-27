import * as dotenv from 'dotenv'
import { Client } from 'pg'

export class pgService {
    private client: any;
    constructor() {
        dotenv.config();
        this.client = new Client({
            host: process.env.PG_HOST,
            port: process.env.PG_PORT,
            user: process.env.PG_USER,
            password: process.env.PG_PASSWORD,
            database: process.env.PG_DATABASE,
          });
        this.client.connect();
    }
    public async getMessages() {
        const text = 'SELECT * FROM messages';
        try {
            const response = await this.client.query(text);
            return response.rows;
        }  catch (err) { console.log(err)}
    }

    public async saveMessage(chat) {
        const text = 'INSERT INTO messages(duty_station, text) VALUES($1, $2) RETURNING *';
        const values = [chat.name, chat.message];  
        try {
            const res = await this.client.query(text, values);
            console.log(res);
        }   catch (err) {
            console.log(err);
        }
    }
}