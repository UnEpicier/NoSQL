import { Request, Response } from 'express';
import {
	createUserInDB,
	getAllUsersInDB,
	getUserInDB,
  getUserCurrencyInDB,
  getUserRankInDB,
  getUserRosterInDB,
	updateUserInDB,
	updateUserCurrencyInDB,
	updateUserRankInDB,
	updateUserRosterInDB,
	deleteUserInDB,
} from './user.services';

const getAllUsers = async (req: Request, res: Response) => {
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

	if (!(username instanceof String) || !(email instanceof String) || !(password instanceof String)) {
		res.status(422).send('Wrong field(s) type in request body');
	}

	try {
		const user = await createUserInDB(
			username,
			email,
			password,
		);

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

	if (!(username instanceof String) || !(email instanceof String) || !(password instanceof String)) {
		res.status(422).send('Wrong field(s) type in request body');
		return;
	}

	try {
		const user = await updateUserInDB(
			id,
			username,
			email,
			password,
		);

		res.status(200).send(user);
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

const updateUserCurrency = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { amount } = req.body || {};

	if (!amount) {
		res.status(400).send('Missing field(s) in request body');
		return;
	}

	if (!parseInt(amount)) {
		res.status(422).send('Wrong field(s) type in request body');
		return;
	}

	try {
		const userCurrency = await updateUserCurrencyInDB(
			id,
			amount,
		);

		res.status(200).send(userCurrency);
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

const updateUserRank = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { amount } = req.body || {};

	if (!amount) {
		res.status(400).send('Missing field(s) in request body');
		return;
	}

	if (!parseInt(amount)) {
		res.status(422).send('Wrong field(s) type in request body');
		return;
	}

	try {
		const userRank = await updateUserRankInDB(
			id,
			amount,
		);

		res.status(200).send(userRank);
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
		const userRank = await updateUserRosterInDB(
			id,
			characters,
		);

		res.status(200).send(userRank);
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
