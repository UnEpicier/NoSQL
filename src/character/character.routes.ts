import { Router } from 'express';
import {
	createCharacter,
	deleteCharacter,
	getAllCharacters,
	getCharacter,
	updateCharacter,
} from './character.controllers';

const router = Router();

router.get('/characters', getAllCharacters);
router.get('/character/:id', getCharacter);

router.post('/character', createCharacter);

router.patch('/character/:id', updateCharacter);

router.delete('/character/:id', deleteCharacter);

export default router;
