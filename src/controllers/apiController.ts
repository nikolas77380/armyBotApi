import { pgService } from '../services/pgService';
import * as jwt from 'jsonwebtoken';
import * as dontenv from 'dotenv';
dontenv.config();
const saveMessage = async (chat) => {
    const pg = new pgService();
    try {
        await pg.saveMessage(chat);
    } catch (err) {
        console.log(err);
    }
}

const getMessages = async (req, res) => {
    const {search} = req.query;
    const pg = new pgService();
    try {
        const messages = await pg.getMessages(search);
        res.send(messages);
    } catch (err) {
        console.log(err);
    }
}

const login = async (req, res) => {
    const {login, password} = req.body;
    if (login === process.env.USER_LOGIN && password === process.env.USER_PASSWORD) {
            const token = jwt.sign(
                {
                  login: process.env.USER_LOGIN
                },
                "RANDOM_TOKEN_SECRET",
                { expiresIn: "24h" }
              );
    
              //   return success response
              res.status(200).send({
                message: "Login Successful",
                login: process.env.USER_LOGIN,
                token,
              });
    } else {
            res.status(400).send({
                message: "Passwords does not match",
              });
    }
}
export { getMessages, saveMessage, login };