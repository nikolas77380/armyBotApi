import { Router } from 'express'
import { getMessages } from './controllers/apiController';
const router = Router();
router.get('/messages', getMessages)

export default router;