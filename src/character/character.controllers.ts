import { Request, Response } from 'express';
import {
	createCharacterInDB,
	getAllCharactersInDB,
	getCharacterInDB,
} from './character.services';

const getAllCharacters = async (_: Request, res: Response) => {
	try {
		const characters = await getAllCharactersInDB();

		if (characters.length > 0) {
			res.status(200).send(characters);
			return;
		}

		res.status(204).json([]);
		return;
	} catch {
		res.status(500).end();
		return;
	}
};

const getCharacter = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const character = await getCharacterInDB(id);

		if (!character) {
			res.status(404).end();
			return;
		}

		res.status(200).json(character);
		return;
	} catch {
		res.status(500).end();
		return;
	}
};

const createCharacter = async (req: Request, res: Response) => {
	const { sprite, hp, attack, defense } = req.body || {};

	if (!sprite || !hp || !attack || !defense) {
		res.status(400).send('Missing field(s) in request body');
		return;
	}

	try {
		const character = await createCharacterInDB(
			sprite,
			hp,
			attack,
			defense,
		);

		res.status(200).json(character);
		return;
	} catch {
		res.status(500).end();
		return;
	}
};

export { getAllCharacters, getCharacter, createCharacter };
