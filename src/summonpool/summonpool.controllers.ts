import { Request, Response } from 'express';
import {
	createSummonPoolInDB,
	getAllSummonPoolsInDB,
	getSummonPoolInDB,
	updateSummonPoolInDB,
	deleteSummonPoolInDB,
} from './summonpool.services';

const getAllSummonPools = async (req: Request, res: Response) => {
	try {
		const summonPools = await getAllSummonPoolsInDB();

		if (summonPools.length > 0) {
			res.status(200).send(summonPools);
			return;
		}

		res.status(204).send([]);
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

const getSummonPool = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const summonPool = await getSummonPoolInDB(id);

		if (!summonPool) {
			res.status(404).end();
			return;
		}

		res.status(200).send(summonPool);
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

const createSummonPool = async (req: Request, res: Response) => {
	const { characters, cost, duration } = req.body || {};

	if (!characters || !cost || !duration) {
		res.status(400).send('Missing field(s) in request body');
		return;
	}

	if (!Array.isArray(characters) || !parseInt(cost) || !parseInt(duration)) {
		res.status(422).send('Wrong field(s) type in request body');
	}

	try {
		const summonpool = await createSummonPoolInDB(
			characters,
			cost,
			duration,
		);

		res.status(200).send(summonpool);
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

const updateSummonPool = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { characters, cost, duration } = req.body || {};

	if (!characters && !cost && !duration) {
		res.status(400).send('Missing field(s) in request body');
		return;
	}

	if ((cost && !parseFloat(cost)) || (duration && !parseInt(duration))) {
		res.status(422).send('Wrong field(s) type in request body');
		return;
	}

	try {
		const summonPool = await updateSummonPoolInDB(
			id,
			characters,
			cost,
			duration,
		);

		res.status(200).send(summonPool);
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

const deleteSummonPool = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		await deleteSummonPoolInDB(id);
		res.status(200).end();
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

export {
	createSummonPool,
	getAllSummonPools,
	getSummonPool,
	updateSummonPool,
	deleteSummonPool,
};
