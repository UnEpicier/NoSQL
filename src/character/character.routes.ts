import { Router } from 'express';
import { getAllCharacters, getCharacter } from './character.controllers';

const router = Router();

router.get('/characters', getAllCharacters);
router.get('/character/:id', getCharacter);

export default router;
