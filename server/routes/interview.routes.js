import express from 'express';
import { startInterview, sendMessage, getInterview } from '../controllers/interview.controller.js';

const router = express.Router();

router.post('/start', startInterview);
router.post('/:id/message', sendMessage);
router.get('/:id', getInterview);

export default router;
