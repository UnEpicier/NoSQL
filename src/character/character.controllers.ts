import { Request, Response } from 'express';
import { getAllCharactersInDB, getCharacterInDB } from './character.services';

const getAllCharacters = async (_: Request, res: Response) => {
	try {
		const characters = await getAllCharactersInDB();

		if (characters.length > 0) {
			res.status(200).send(characters);
			return;
		}

		res.status(204).send([]);
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

		res.status(200).send(character);
		return;
	} catch {
		res.status(500).end();
		return;
	}
};

export { getAllCharacters, getCharacter };
