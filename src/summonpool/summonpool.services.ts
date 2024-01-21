import { v4 } from 'uuid';
import redisClient from '@utils/redis';
import { SummonPool } from '../types/summonpool';
import { Character } from '../types/character';

const createSummonPoolInDB = async (
	characters: string[],
	cost: number,
	duration: number,
): Promise<SummonPool> => {
	try {
		const key = `summonpool:${v4()}`;

		characters = characters.map((id) => {
			return id.includes('character:') ? id : `character:${id}`;
		});

		await redisClient.connect();

		await redisClient.HSET(key, 'characters', JSON.stringify(characters));
		await redisClient.HSET(key, 'cost', cost);
		await redisClient.HSET(key, 'duration', duration);

		// Populate characters array
		const populatedCharacters: Character[] = await Promise.all(
			characters.map(async (character) => {
				const result = await redisClient.HGETALL(character);

				return {
					id: character,
					sprite: result[1],
					hp: parseInt(result[3]),
					attack: parseFloat(result[5]),
					defense: parseFloat(result[7]),
				};
			}),
		);

		await redisClient.quit();

		return {
			id: key,
			characters: populatedCharacters,
			cost: cost,
			duration: duration,
		};
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error(`Unable to create Summon Pool`);
	}
};

export { createSummonPoolInDB };
