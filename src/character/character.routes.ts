import { Router } from 'express';
import {
	createCharacter,
	getAllCharacters,
	getCharacter,
} from './character.controllers';

const router = Router();

router.get('/characters', getAllCharacters);
router.get('/character/:id', getCharacter);

router.post('/character', createCharacter);

export default router;
