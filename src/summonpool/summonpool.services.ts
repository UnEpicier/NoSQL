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

const getSummonPoolInDB = async (id: string): Promise<SummonPool | null> => {
	try {
		const key = id.includes('summonpool:') ? id : `summonpool:${id}`;

		await redisClient.connect();

		const exists = await redisClient.EXISTS(key);

		if (exists == 0) {
			await redisClient.quit();

			return null;
		}

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

		await redisClient.quit();

		return {
			id: key,
			characters: populatedCharacters,
			cost: parseFloat(result.cost),
			duration: parseInt(result.duration),
		};
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error(`Unable to get summon pool with id: ${id}`);
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

const updateSummonPoolInDB = async (
	id: string,
	characters: string[],
	cost: number,
	duration: number,
): Promise<SummonPool> => {
	try {
		await redisClient.connect();

		const key = id.includes('summonpool:') ? id : `summonpool:${id}`;

		if (characters) {
			await redisClient.HSET(
				key,
				'characters',
				JSON.stringify(characters),
			);
		}

		if (cost) {
			await redisClient.HSET(key, 'cost', cost);
		}

		if (duration) {
			await redisClient.HSET(key, 'duration', duration);
		}

		const result = await redisClient.HGETALL(key);

		const chars: string[] = characters
			? characters
			: JSON.parse(result.characters);

		// Populate characters array
		const populatedCharacters: Character[] = await Promise.all(
			chars.map(async (character) => {
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
			cost: parseFloat(result.cost),
			duration: parseInt(result.duration),
		};
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error(`Unable to update summon pool with id: ${id}`);
	}
};

const deleteSummonPoolInDB = async (id: string): Promise<void> => {
	try {
		const key = id.includes('summonpool:') ? id : `summonpool:${id}`;

		await redisClient.connect();

		await redisClient.DEL(key);

		await redisClient.quit();
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error(`Unable to delete summon pool with id: ${id}`);
	}
};

export {
	getAllSummonPoolsInDB,
	createSummonPoolInDB,
	getSummonPoolInDB,
	updateSummonPoolInDB,
	deleteSummonPoolInDB,
};
