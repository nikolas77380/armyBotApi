import * as dotenv from 'dotenv'
import TelegramBot from "node-telegram-bot-api";
import express from 'express';
import e from 'express';
const app = express();
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

bot.on('message', (msg) => {
    console.log(msg)
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
    } else if (msg.reply_to_message.text === "Укажіть будь ласка з якої Ви бригади") {
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
    } else if (msg.reply_to_message.text === 'Опишіть будь ласка проблему') {
        chats.find(el => el.id === fromId).message = msg.text;
        bot.sendMessage(
            id,
            `Дякуємо. інформація зафіксована! Слава Україні! Смерь Ворогам!`,
        )
    } else {
        bot.sendMessage(
            id,
            `Привіт! Тут Ви можете надати інформацію про пробеми нв службі!`);
        return;
    }
    
}); 

const port = 8008;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});