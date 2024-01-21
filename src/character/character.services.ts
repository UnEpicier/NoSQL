import { v4 } from 'uuid';
import redisClient from '@utils/redis';
import { Character } from '../types/character';

const getAllCharactersInDB = async (): Promise<Character[]> => {
	try {
		await redisClient.connect();

		const matchingKeys = await redisClient.KEYS('character:*');

		const characters: Character[] = await Promise.all(
			matchingKeys.map(async (key) => {
				const result = await redisClient.HGETALL(key);

				return {
					id: key,
					sprite: result.sprite,
					hp: parseInt(result.hp),
					attack: parseFloat(result.attack),
					defense: parseFloat(result.defense),
				};
			}),
		);

		await redisClient.quit();

		return characters;
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error('Unable to get characters');
	}
};

const getCharacterInDB = async (id: string): Promise<Character | null> => {
	try {
		const key = id.includes('character:') ? id : `character:${id}`;

		await redisClient.connect();

		const exists = await redisClient.EXISTS(key);

		if (exists == 0) {
			await redisClient.quit();

			return null;
		}

		const result = await redisClient.HGETALL(key);

		await redisClient.quit();

		return {
			id: key,
			sprite: result.sprite,
			hp: parseInt(result.hp),
			attack: parseFloat(result.attack),
			defense: parseFloat(result.defense),
		};
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error(`Unable to get character with id: ${id}`);
	}
};

const createCharacterInDB = async (
	sprite: string,
	hp: number,
	attack: number,
	defense: number,
): Promise<Character> => {
	try {
		const key = `character:${v4()}`;

		await redisClient.connect();

		await redisClient.HSET(key, 'sprite', sprite);
		await redisClient.HSET(key, 'hp', hp);
		await redisClient.HSET(key, 'attack', attack);
		await redisClient.HSET(key, 'defense', defense);

		await redisClient.quit();

		return {
			id: key,
			sprite: sprite,
			hp: hp,
			attack: attack,
			defense: defense,
		};
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error(`Unable to create character`);
	}
};

const updateCharacterInDB = async (
	id: string,
	sprite: string,
	hp: number,
	attack: number,
	defense: number,
): Promise<Character> => {
	try {
		await redisClient.connect();

		const key = id.includes('character:') ? id : `character:${id}`;

		if (sprite) {
			await redisClient.HSET(key, 'sprite', sprite);
		}

		if (hp) {
			await redisClient.HSET(key, 'hp', hp);
		}

		if (attack) {
			await redisClient.HSET(key, 'attack', attack);
		}

		if (defense) {
			await redisClient.HSET(key, 'defense', defense);
		}

		const result = await redisClient.HGETALL(key);

		await redisClient.quit();

		return {
			id: key,
			sprite: result.sprite,
			hp: parseInt(result.hp),
			attack: parseFloat(result.attack),
			defense: parseFloat(result.defense),
		};
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error(`Unable to update character with it: ${id}`);
	}
};

const deleteCharacterInDB = async (id: string) => {
	try {
		const key = id.includes('character:') ? id : `character:${id}`;

		await redisClient.connect();

		await redisClient.DEL(key);

		await redisClient.quit();

		return;
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error(`Unable to delete character with id: ${id}`);
	}
};

export {
	getAllCharactersInDB,
	getCharacterInDB,
	createCharacterInDB,
	updateCharacterInDB,
	deleteCharacterInDB,
};
