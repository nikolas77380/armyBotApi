import * as dotenv from 'dotenv'
import TelegramBot from "node-telegram-bot-api";
import express from 'express';
import router from './src/routes';
import { saveMessage, getCountMessagesByUserName } from './src/controllers/apiController';
import cors from 'cors';
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
    const {id: fromId, username, is_bot} = msg.from;

    if (text === '/start') {
        if (is_bot){
            bot.sendMessage(
                id,
                `Ви не можете використовувати бота!`,
            );
            return;
        }
        bot.sendMessage(
            id,
            `Привіт! Тут Ви можете надати інформацію про пробеми нв службі!`);
    } else if (text === '/message') { 
        const countExistingMessages = getCountMessagesByUserName(username);
        if (msg.from.is_bot || countExistingMessages >= 2){
            bot.sendMessage(
                id,
                `Ви не можете використовувати бота!`,
            );
            return;
        }
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
        chats.find(el => el.id === fromId).username = username;
        bot.sendMessage(
            id,
            `Дякуємо! інформація зафіксована! Слава Україні! Смерть Ворогам!`,
        );
        saveMessage(chats.find(el => el.id === fromId));
        const index = chats.findIndex(el => el.id === fromId);
        chats.splice(index, 1);
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
const allowedOrigins = ['http://localhost', 'http://161.35.194.26'];
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }

}));
app.use('/', router)