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
	const { name, attack, defense, hp, sprite } = req.body || {};

	if (!name || !sprite || !hp || !attack || !defense) {
		res.status(400).send('Missing field(s) in request body');
		return;
	}

	if (!parseInt(hp) || !parseInt(attack) || !parseInt(defense)) {
		res.status(422).send('Wrong field(s) type in request body');
		return;
	}

	const fields: any = {};

	if (name) fields['name'] = name;
	if (attack) fields['attack'] = attack;
	if (defense) fields['defense'] = defense;
	if (hp) fields['hp'] = hp;
	if (sprite) fields['sprite'] = sprite;

	try {
		const character = await createCharacterInDB(fields);

		res.status(200).send(character);
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

const updateCharacter = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { name, attack, defense, hp, sprite } = req.body || {};

	if (!name && !sprite && !hp && !attack && !defense) {
		res.status(400).send('Missing field(s) in request body');
		return;
	}

	if (
		(hp && !parseInt(hp)) ||
		(attack && !parseInt(attack)) ||
		(defense && !parseInt(defense))
	) {
		res.status(422).send('Wrong field(s) type in request body');
		return;
	}

	const fields: any = {};

	if (name) fields['name'] = name;
	if (attack) fields['attack'] = attack;
	if (defense) fields['defense'] = defense;
	if (hp) fields['hp'] = hp;
	if (sprite) fields['sprite'] = sprite;

	try {
		const character = await updateCharacterInDB(id, fields);
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
