import { Request, Response } from 'express';
import { createSummonPoolInDB } from './summonpool.services';

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

export { createSummonPool };
