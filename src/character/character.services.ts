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
					sprite: result[1],
					hp: parseInt(result[3]),
					attack: parseFloat(result[5]),
					defense: parseFloat(result[7]),
				};
			}),
		);

		await redisClient.disconnect();

		return characters;
	} catch (error) {
		console.error(error);
		await redisClient.disconnect();

		throw Error('Unable to get characters');
	}
};

const getCharacterInDB = async (id: string): Promise<Character | null> => {
	try {
		const key = id.includes('character:') ? id : `character:${id}`;

		await redisClient.connect();

		const exists = await redisClient.EXISTS(key);

		if (exists == 0) {
			await redisClient.disconnect();

			return null;
		}

		const result = await redisClient.HGETALL(key);

		await redisClient.disconnect();

		return {
			id: key,
			sprite: result.sprite,
			hp: parseInt(result.hp),
			attack: parseFloat(result.attack),
			defense: parseFloat(result.defense),
		};
	} catch (error) {
		console.error(error);
		await redisClient.disconnect();

		throw Error(`Unable to get character with id: ${id}`);
	}
};

export { getAllCharactersInDB, getCharacterInDB };
