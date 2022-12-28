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
    }
    public async getMessages(search: string) {
        this.client.connect();
        const text = `SELECT * FROM 'notifications' WHERE LOWER(duty_station) LIKE LOWER('%${search}%') OR LOWER(text) LIKE LOWER('%${search}%') OR LOWER(user_name) LIKE LOWER('%${search}%') ORDER BY created_on DESC`;
        try {
            const response = await this.client.query(text);
            this.client.end();
            return response.rows;
            
        }  catch (err) {
             console.log(err) 
             this.client.end();
        }
    }
    public async getCountMessagesByUserName(search: string) {
        this.client.connect();
        const count = `SELECT COUNT(*) FROM 'notifications' WHERE LOWER(user_name) = LOWER('%${search}%')`;
        try {
            const response = await this.client.query(count);
            this.client.end();
            return response.rows;
            
        }  catch (err) {
             console.log(err) 
             this.client.end();
        }
    }
    public async saveMessage(chat) {
        this.client.connect();
        const text = 'INSERT INTO notifications(duty_station, text, user_name) VALUES($1, $2 ,$3) RETURNING *';
        const values = [chat.name, chat.message, chat.username];  
        try {
            const res = await this.client.query(text, values);
            console.log(res);
            this.client.end();
        }   catch (err) {
            console.log(err);
            this.client.end();
        }
    }
}