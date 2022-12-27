import * as dotenv from 'dotenv'
import TelegramBot from "node-telegram-bot-api";
import express from 'express';
import router from './src/routes';
import { saveMessage } from './src/controllers/apiController';

dotenv.config();
const TOKEN = process.env.TOKEN;
const commands = [
    {command: '/start', description: 'Розпочати роботу з ботом'},
    {command: '/message', description: 'Надати інформацію про проблему'},
    {command: '/help', description: 'Help'},
]

const bot = new TelegramBot(TOKEN, {polling: true});

const chats = [];

bot.setMyCommands(commands);

bot.on('message', async (msg) => {
    const {id} = msg.chat;
    const text = msg.text;
    const {id: fromId} = msg.from;

    if (text === '/start') {
        bot.sendMessage(
            id,
            `Привіт! Тут Ви можете надати інформацію про пробеми нв службі!`);
    } else if (text === '/message') { 
        const opts = {
            reply_markup: {
                force_reply: true,
            }
        }
        if (chats.find(el => el.id === fromId)) {
            bot.sendMessage(
                id,
                `Ви вже надали інформацію, дякуємо!`,
            );
            return;
        } 
        bot.sendMessage(
            id,
            `Укажіть будь ласка з якої Ви бригади`,
            opts
        )
    } else if (msg.reply_to_message?.text === "Укажіть будь ласка з якої Ви бригади") {
        chats.push({id: fromId, name: msg.text})
        const opts = {
            reply_markup: {
                force_reply: true,
            }
        }
        bot.sendMessage(
            id,
            `Опишіть будь ласка проблему`,
            opts
        );
    } else if (msg.reply_to_message?.text === 'Опишіть будь ласка проблему') {
        chats.find(el => el.id === fromId).message = msg.text;
        bot.sendMessage(
            id,
            `Дякуємо! інформація зафіксована! Слава Україні! Смерть Ворогам!`,
        );
        saveMessage(chats.find(el => el.id === fromId));
    } else {
        bot.sendMessage(
            id,
            `Привіт! Тут Ви можете надати інформацію про пробеми нв службі!`);
        return;
    }
    
}); 

const port = 8008;
const app = express();

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

app.use(express.json());
app.use('/', router)