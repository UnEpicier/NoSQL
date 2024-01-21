import { Router } from 'express';
import {
	createCharacter,
	getAllCharacters,
	getCharacter,
	updateCharacter,
} from './character.controllers';

const router = Router();

router.get('/characters', getAllCharacters);
router.get('/character/:id', getCharacter);

router.post('/character', createCharacter);

router.patch('/character/:id', updateCharacter);

export default router;
