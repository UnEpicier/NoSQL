import { Request, Response } from 'express';
import { getAllCharactersInDB } from './character.services';

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

export { getAllCharacters };
