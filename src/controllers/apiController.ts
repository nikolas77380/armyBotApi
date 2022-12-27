import { pgService } from '../services/pgService';

const saveMessage = async (chat) => {
    const pg = new pgService();
    try {
        await pg.saveMessage(chat);
    } catch (err) {
        console.log(err);
    }
}

const getMessages = async (req, res) => {
    const pg = new pgService();
    try {
        const messages = await pg.getMessages();
        res.send(messages);
    } catch (err) {
        console.log(err);
    }
}

export { getMessages, saveMessage };