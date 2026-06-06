 import express from 'express';
const router = express.Router();
import { handleNewAccountConnection } from '../../controllers/connectController.js';

router.get('/', handleNewAccountConnection);

export { router };
