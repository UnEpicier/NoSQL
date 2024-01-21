import { Request, Response } from 'express';
import {
	createCharacterInDB,
	deleteCharacterInDB,
	getAllCharactersInDB,
	getCharacterInDB,
	updateCharacterInDB,
} from './character.services';

const getAllCharacters = async (_: Request, res: Response) => {
	try {
		const characters = await getAllCharactersInDB();

		if (characters.length > 0) {
			res.status(200).send(characters);
			return;
		}

		res.status(204).send([]);
		return;
	} catch (error) {
		res.status(500).send(error);
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

		res.status(200).send(character);
		return;
	} catch (error) {
		res.status(500).send(error);
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

		res.status(200).send(character);
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

const updateCharacter = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { sprite, hp, attack, defense } = req.body || {};

	if (!sprite && !hp && !attack && !defense) {
		res.status(400).send('Missing field(s) in request body');
		return;
	}

	try {
		const character = await updateCharacterInDB(
			id,
			sprite,
			hp,
			attack,
			defense,
		);

		res.status(200).send(character);
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

const deleteCharacter = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		await deleteCharacterInDB(id);
		res.status(200).end();
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

export {
	getAllCharacters,
	getCharacter,
	createCharacter,
	updateCharacter,
	deleteCharacter,
};
