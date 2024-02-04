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
router.get('/characters/:id', getCharacter);

router.post('/characters', createCharacter);

router.patch('/characters/:id', updateCharacter);

router.delete('/characters/:id', deleteCharacter);

export default router;
