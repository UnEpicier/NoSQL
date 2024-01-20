import { Router } from 'express';
import { getAllCharacters } from './character.controllers';

const router = Router();

router.get('/characters', getAllCharacters);

export default router;
