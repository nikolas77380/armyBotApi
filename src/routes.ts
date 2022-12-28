import { Router } from 'express'
import { getMessages, login } from './controllers/apiController';
import auth from './auth';
const router = Router();
router.get('/messages',auth, getMessages)
router.post('/login', login)

export default router;