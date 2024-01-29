import { v4 } from 'uuid';
import redisClient from '@utils/redis';
import { Character } from '../types/character';
import { User, UpdateUser } from '../types/user';

const getAllUsersInDB = async (): Promise<User[]> => {
	try {
		await redisClient.connect();

		const matchingKeys = await redisClient.KEYS('user:*');

		const usersResult: User[] = await Promise.all(
			matchingKeys.map(async (key) => {
				const result = await redisClient.HGETALL(key);
				const characters: string[] = JSON.parse(result.roster);
				const populatedCharacters: Character[] = await Promise.all(
					characters.map(async (character) => {
						const result = await redisClient.HGETALL(character);

						return {
							id: character,
							sprite: result.sprite,
							hp: parseInt(result.hp),
							attack: parseFloat(result.attack),
							defense: parseFloat(result.defense),
						};
					}),
				);

				return {
					id: result.id,
					username: result.username,
					email: result.email,
					password: result.password,
					currency: parseInt(result.currency),
					rank: parseInt(result.rank),
					roster: populatedCharacters,
				};
			}),
		);

		await redisClient.quit();

		return usersResult;
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error('Unable to get users');
	}
};

const getUserInDB = async (id: string): Promise<User | null> => {
	try {
		const key = id.includes('user:') ? id : `user:${id}`;

		await redisClient.connect();

		const exists = await redisClient.EXISTS(key);

		if (exists == 0) {
			await redisClient.quit();

			return null;
		}

		const result = await redisClient.HGETALL(key);

		const characters: string[] = JSON.parse(result.roster);

		const populatedCharacters: Character[] = await Promise.all(
			characters.map(async (character) => {
				const result = await redisClient.HGETALL(character);

				return {
					id: character,
					sprite: result.sprite,
					hp: parseInt(result.hp),
					attack: parseFloat(result.attack),
					defense: parseFloat(result.defense),
				};
			}),
		);

		await redisClient.quit();

		return {
			id: result.id,
			username: result.username,
			email: result.email,
			password: result.password,
			currency: parseInt(result.currency),
			rank: parseInt(result.rank),
			roster: populatedCharacters,
		};
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error(`Unable to get user with id: ${id}`);
	}
};

const createUserInDB = async (
	username: string,
	email: string,
	password: string,
): Promise<User> => {
	try {
		const key = `user:${v4()}`;

		await redisClient.connect();

		await redisClient.HSET(key, 'username', username);
		await redisClient.HSET(key, 'email', email);
		await redisClient.HSET(key, 'password', password);
		await redisClient.HSET(key, 'currency', 10);
		await redisClient.HSET(key, 'rank', 0);
		await redisClient.HSET(key, 'roster', '[]');

		await redisClient.quit();

		return {
			id: key,
			username: username,
			email: email,
			password: password,
			currency: 10,
			rank: 0,
			roster: [],
		};
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error(`Unable to create user`);
	}
};

const updateUserInDB = async (
	id: string,
	params: UpdateUser,
): Promise<User | null> => {
	try {
		await redisClient.connect();

		const key = id.includes('user:') ? id : `user:${id}`;

		if (params.roster) {
			await redisClient.HSET(
				key,
				'roster',
				JSON.stringify(params.roster),
			);
		}

		if (params.username) {
			await redisClient.HSET(key, 'username', params.username);
		}

		if (params.email) {
			await redisClient.HSET(key, 'email', params.email);
		}

		if (params.password) {
			await redisClient.HSET(key, 'password', params.password);
		}

		let result = await getUserInDB(key);

		if (!result) {
			return result;
		}

		if (params.currency) {
			result.currency += params.currency;
			await redisClient.HSET(key, 'currency', result.currency);
		}

		if (params.rank) {
			result.currency += params.rank;
			await redisClient.HSET(key, 'rank', result.rank);
		}

		await redisClient.quit();

		return result;
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error(`Unable to update user with id: ${id}`);
	}
};

const deleteUserInDB = async (id: string): Promise<void> => {
	try {
		const key = id.includes('user:') ? id : `user:${id}`;

		await redisClient.connect();

		await redisClient.DEL(key);

		await redisClient.quit();
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error(`Unable to delete user with id: ${id}`);
	}
};

const getUserCurrencyInDB = async (id: string): Promise<number | null> => {
	try {
		const key = id.includes('user:') ? id : `user:${id}`;

		await redisClient.connect();

		const exists = await redisClient.EXISTS(key);

		if (exists == 0) {
			await redisClient.quit();

			return null;
		}

		const result = await redisClient.HGET(key, 'currency');

		await redisClient.quit();

		if (result) {
			return parseInt(result);
		}
		return null;
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error(`Unable to get user currency with id: ${id}`);
	}
};

const getUserRankInDB = async (id: string): Promise<number | null> => {
	try {
		const key = id.includes('user:') ? id : `user:${id}`;

		await redisClient.connect();

		const exists = await redisClient.EXISTS(key);

		if (exists == 0) {
			await redisClient.quit();

			return null;
		}

		const result = await redisClient.HGET(key, 'rank');

		await redisClient.quit();

		if (result) {
			return parseInt(result);
		}
		return null;
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error(`Unable to get user currency with id: ${id}`);
	}
};

const getUserRosterInDB = async (id: string): Promise<Character[] | null> => {
	try {
		const key = id.includes('user:') ? id : `user:${id}`;

		await redisClient.connect();

		const exists = await redisClient.EXISTS(key);

		if (exists == 0) {
			await redisClient.quit();

			return null;
		}

		const result = await redisClient.HGET(key, 'roster');

		if (!result) {
			await redisClient.quit();
			return null;
		}

		const characters: string[] = JSON.parse(result);

		const populatedCharacters: Character[] = await Promise.all(
			characters.map(async (character) => {
				const result = await redisClient.HGETALL(character);

				return {
					id: character,
					sprite: result.sprite,
					hp: parseInt(result.hp),
					attack: parseFloat(result.attack),
					defense: parseFloat(result.defense),
				};
			}),
		);

		await redisClient.quit();
		return populatedCharacters;
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error(`Unable to get user currency with id: ${id}`);
	}
};

export {
	createUserInDB,
	getAllUsersInDB,
	getUserInDB,
	updateUserInDB,
	deleteUserInDB,
	getUserCurrencyInDB,
	getUserRankInDB,
	getUserRosterInDB,
};
