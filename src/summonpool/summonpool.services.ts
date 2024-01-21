import { v4 } from 'uuid';
import redisClient from '@utils/redis';
import { SummonPool } from '../types/summonpool';
import { Character } from '../types/character';

const getAllSummonPoolsInDB = async (): Promise<SummonPool[]> => {
	try {
		await redisClient.connect();

		const matchingKeys = await redisClient.KEYS('summonpool:*');

		const summonPools: SummonPool[] = await Promise.all(
			matchingKeys.map(async (key) => {
				const result = await redisClient.HGETALL(key);

				const characters: string[] = JSON.parse(result.characters);

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
					id: key,
					characters: populatedCharacters,
					cost: parseFloat(result.cost),
					duration: parseInt(result.duration),
				};
			}),
		);

		await redisClient.quit();

		return summonPools;
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error('Unable to get summon pools');
	}
};

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
					sprite: result.sprite,
					hp: parseInt(result.hp),
					attack: parseFloat(result.attack),
					defense: parseFloat(result.defense),
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

export { getAllSummonPoolsInDB, createSummonPoolInDB };
