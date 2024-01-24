// ---------------------------------------------------------------------------------------------------------------------

// ------------------------------------------------------ Types --------------------------------------------------------
import redisClient from '@utils/redis';
import { Character } from '../types/character';
import CharacterModel from '@models/Character';
import { connectToDB } from '@utils/database';

const getAllCharactersInDB = async (): Promise<Character[]> => {
	try {
		// Get all stored characters in DB
		const db = await connectToDB();
		const dbCharacter: Character[] = await CharacterModel.find({});

		await redisClient.connect();
		// Add new in cache
		for (let i = 0; i < dbCharacter.length; i++) {
			await redisClient.HSET(
				`character:${dbCharacter[i]._id}`,
				'attack',
				dbCharacter[i].attack,
			);
			await redisClient.HSET(
				`character:${dbCharacter[i]._id}`,
				'defense',
				dbCharacter[i].defense,
			);
			await redisClient.HSET(
				`character:${dbCharacter[i]._id}`,
				'hp',
				dbCharacter[i].hp,
			);
			await redisClient.HSET(
				`character:${dbCharacter[i]._id}`,
				'sprite',
				dbCharacter[i].sprite,
			);
		}

		await db.disconnect();
		await redisClient.quit();

		return dbCharacter;
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error('Unable to get characters');
	}
};

const getCharacterInDB = async (id: string): Promise<Character | null> => {
	if (id.length != 24) {
		return null;
	}
	try {
		// Get from cache
		await redisClient.connect();
		if ((await redisClient.EXISTS(`character:${id}`)) == 0) {
			// Try to get it from db
			redisClient.quit();
			const db = await connectToDB();
			const character: Character | null | undefined =
				await CharacterModel.findById(id);
			await db.disconnect();
			return character ? character : null;
		}
		const cacheCharacter = await redisClient.HGETALL(`character:${id}`);
		await redisClient.quit();
		const character: Character = {
			_id: id,
			attack: parseInt(cacheCharacter.attack),
			defense: parseInt(cacheCharacter.defense),
			hp: parseInt(cacheCharacter.hp),
			sprite: cacheCharacter.sprite,
		};
		return character ? character : null;
	} catch (error) {
		console.error(error);
		throw Error(`Unable to get character with id: ${id}`);
	}
};

const createCharacterInDB = async (fields: Object): Promise<Character> => {
	try {
		const db = await connectToDB();

		const { _id } = await CharacterModel.create(fields);

		const character = await CharacterModel.findById(_id);

		await db.disconnect();

		return character;
	} catch (error) {
		console.error(error);

		throw Error(`Unable to create character`);
	}
};

const updateCharacterInDB = async (
	id: string,
	fields: Object,
): Promise<Character | null> => {
	try {
		// Delete from cache
		await redisClient.connect();
		await redisClient.DEL(`character:${id}`);
		await redisClient.quit();

		// Update in DB
		const db = await connectToDB();
		const character: Character | null | undefined =
			await CharacterModel.findByIdAndUpdate(id, fields, {
				new: true,
			});

		await db.disconnect();

		return character ? character : null;
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error(`Unable to update character with id: ${id}`);
	}
};

const deleteCharacterInDB = async (id: string): Promise<void> => {
	try {
		await redisClient.connect();
		await redisClient.DEL(id);
		await redisClient.quit();

		const db = await connectToDB();
		await CharacterModel.findByIdAndDelete(id);
		await db.disconnect();
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw new Error(`Unable to delete character with id: ${id}`);
	}
};

export {
	createCharacterInDB,
	deleteCharacterInDB,
	getAllCharactersInDB,
	getCharacterInDB,
	updateCharacterInDB,
};
