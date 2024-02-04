import redisClient from '@utils/redis';
import { Character } from '../types/character';
import { User, UpdateUser } from '../types/user';
import { connectToDB } from '@utils/database';
import UserModel from '@models/User';

const getAllUsersInDB = async (): Promise<User[]> => {
	try {

		// Get all stored summon pools in DB
		const db = await connectToDB();
		const allUsers: User[] = await UserModel.find(
			{},
		).populate('roster');
		await db.disconnect();
		return allUsers;
	} catch (error) {
		console.error(error);
		throw Error('Unable to get users');
	}
};

const getUserInDB = async (id: string): Promise<User | null | undefined> => {
	try {

		// Try to get it from db
		const db = await connectToDB();

		const user: User | null | undefined =
			await UserModel.findById(id).populate('roster');

		await db.disconnect();
		return user;
		
	} catch (error) {
		console.error(error);
		throw Error(`Unable to get user with id: ${id}`);
	}
};

const createUserInDB = async (
	username: string,
	email: string,
	password: string,
): Promise<User> => {
	try {
		const db = await connectToDB();

		const { _id } = await UserModel.create({
			username,
			email,
			password,
			currency: 10,
			rank: 0,
			roster: [],
		});

		const user = await UserModel.findById(_id).populate(
			'roster',
		);

		await db.disconnect();

		return user;
	} catch (error) {
		console.error(error);
		throw Error(`Unable to create user`);
	}
};

const updateUserInDB = async (
	id: string,
	params: UpdateUser,
): Promise<User | null> => {
	try {
		// Update in DB
		const db = await connectToDB();
		const user: User | null | undefined =
		await UserModel.findByIdAndUpdate(id, params, {
			new: true,
		}).populate('roster');
		
		if (params.roster)
		{
			
		}
		
		await db.disconnect();

		return user ? user : null;

	} catch (error) {
		console.error(error);
		throw Error(`Unable to update user with id: ${id}`);
	}
};

const deleteUserInDB = async (id: string): Promise<void> => {
	try {
		// Delete from DB
		const db = await connectToDB();
		UserModel.findByIdAndDelete(id);
		await db.disconnect();

	} catch (error) {
		console.error(error);
		throw Error(`Unable to delete user with id: ${id}`);
	}
};

const getUserCurrencyInDB = async (id: string): Promise<number | null> => {
	try {
		const user = await getUserInDB(id);
		return user ? user.currency : null;
	} catch (error) {
		console.error(error);
		throw Error(`Unable to get user currency with id: ${id}`);
	}
};

const getUserRankInDB = async (id: string): Promise<number | null> => {
	try {
		const user = await getUserInDB(id);
		return user ? user.rank : null;
	} catch (error) {
		console.error(error);
		throw Error(`Unable to get user currency with id: ${id}`);
	}
};



const getUserRosterInDB = async (id: string): Promise<Character[] | null | undefined> => {
	try {
		const key = id.includes('user:') ? id : `user:${id}`;

		await redisClient.connect();

		const exists = await redisClient.EXISTS(key);

		if (exists == 0) {
			const user = await getUserInDB(id);
			await redisClient.HSET(key, 'roster', JSON.stringify(user?.roster));
			await redisClient.quit();
			return user?.roster;
		}

		const result = await redisClient.HGET(key, 'roster');

		if (!result) {
			const user = await getUserInDB(id);
			await redisClient.HSET(key, 'roster', JSON.stringify(user?.roster));
			await redisClient.quit();
			return user?.roster;
		}

		const characters: string[] = JSON.parse(result);

		const populatedCharacters: Character[] = await Promise.all(
			characters.map(async (character) => {
				const result = await redisClient.HGETALL(character);

				return {
					_id: character,
					name: result.name,
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
