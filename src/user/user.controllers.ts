import { Request, Response } from 'express';
import {
	createUserInDB,
	getAllUsersInDB,
	getUserInDB,
	getUserCurrencyInDB,
	getUserRankInDB,
	getUserRosterInDB,
	updateUserInDB,
	deleteUserInDB,
} from './user.services';

const getAllUsers = async (_: Request, res: Response) => {
	try {
		const users = await getAllUsersInDB();

		if (users.length > 0) {
			res.status(200).send(users);
			return;
		}

		res.status(204).send([]);
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

const getUser = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const user = await getUserInDB(id);

		if (!user) {
			res.status(404).end();
			return;
		}

		res.status(200).send(user);
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

const getUserCurrency = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const userCurrency = await getUserCurrencyInDB(id);

		if (!userCurrency) {
			res.status(404).end();
			return;
		}

		res.status(200).send(userCurrency);
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

const getUserRank = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const userRank = await getUserRankInDB(id);

		if (!userRank) {
			res.status(404).end();
			return;
		}

		res.status(200).send(userRank);
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

const getUserRoster = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const userRoster = await getUserRosterInDB(id);

		if (!userRoster) {
			res.status(404).end();
			return;
		}

		res.status(200).send(userRoster);
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

const createUser = async (req: Request, res: Response) => {
	const { username, email, password } = req.body || {};

	if (!username || !email || !password) {
		res.status(400).send('Missing field(s) in request body');
		return;
	}

	if (
		typeof username != 'string' ||
		typeof email != 'string' ||
		typeof password != 'string'
	) {
		res.status(422).send('Wrong field(s) type in request body');
		return;
	}

	try {
		const user = await createUserInDB(username, email, password);

		res.status(200).send(user);
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

const updateUser = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { username, email, password } = req.body || {};

	if (!username && !email && !password) {
		res.status(400).send('Missing field(s) in request body');
		return;
	}

	if (
		(username && typeof username !== 'string') ||
		(email && typeof email !== 'string') ||
		(password && typeof password !== 'string')
	) {
		res.status(422).send('Wrong field(s) type in request body');
		return;
	}

	try {
		const user = await updateUserInDB(id, {
			username,
			email,
			password,
		});
		if (!user) {
			res.status(404).send(user);
			return;
		}
		res.status(200).send(user);
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

const updateUserCurrency = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { currency } = req.body || {};

	if (!currency) {
		res.status(400).send('Missing field(s) in request body');
		return;
	}

	if (!parseInt(currency)) {
		res.status(422).send('Wrong field(s) type in request body');
		return;
	}

	try {
		const user = await updateUserInDB(id, {
			currency,
		});

		if (!user) {
			res.status(404).send(user);
			return;
		}

		res.status(200).send(user.currency);
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

const updateUserRank = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { rank } = req.body || {};

	if (!rank) {
		res.status(400).send('Missing field(s) in request body');
		return;
	}

	if (!parseInt(rank)) {
		res.status(422).send('Wrong field(s) type in request body');
		return;
	}

	try {
		const user = await updateUserInDB(id, {
			rank,
		});

		if (!user) {
			res.status(404).send(user);
			return;
		}

		res.status(200).send(user.rank);
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

const updateUserRoster = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { characters } = req.body || {};

	if (!characters) {
		res.status(400).send('Missing field(s) in request body');
		return;
	}

	if (!Array.isArray(characters)) {
		res.status(422).send('Wrong field(s) type in request body');
		return;
	}

	try {
		const user = await updateUserInDB(id, {
			roster: characters,
		});

		if (!user) {
			res.status(404).send(user);
			return;
		}

		res.status(200).send(JSON.stringify(user.roster));
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

const deleteUser = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		await deleteUserInDB(id);
		res.status(200).end();
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

export {
	createUser,
	getAllUsers,
	getUser,
	getUserCurrency,
	getUserRank,
	getUserRoster,
	updateUser,
	updateUserCurrency,
	updateUserRank,
	updateUserRoster,
	deleteUser,
};
