// ----------------------------------------------------- Models --------------------------------------------------------
import SummonPoolModel from '@models/SummonPool';
// ---------------------------------------------------------------------------------------------------------------------

// ------------------------------------------------------ Utils --------------------------------------------------------
import redisClient from '@utils/redis';
import { connectToDB } from '@utils/database';
import { includes, isEqual } from 'lodash';
// ---------------------------------------------------------------------------------------------------------------------

// ------------------------------------------------------ Types --------------------------------------------------------
import { SummonPool } from '../types/summonpool';
// ---------------------------------------------------------------------------------------------------------------------

const getAllSummonPoolsInDB = async (): Promise<SummonPool[]> => {
	try {
		await redisClient.connect();

		// Get all sotred summon pools in cache
		const cacheKeys = await redisClient.KEYS('summonpool:*');

		const cacheSummonPools: SummonPool[] = [];

		for (const key in cacheKeys) {
			const summonPool = await redisClient.HGETALL(`summonpool:${key}`);

			cacheSummonPools.push({
				_id: key,
				characters: JSON.parse(summonPool.characters),
				cost: parseFloat(summonPool.cost),
				duration: parseInt(summonPool.duration),
			});
		}

		// Get all stored summon pools in DB
		const db = await connectToDB();
		const dbSummonPools: SummonPool[] = await SummonPoolModel.find(
			{},
		).populate('characters');

		// Determine which one need to be delete or updated
		const toDeleteFromCache = cacheSummonPools.filter(
			(x) => !includes(dbSummonPools, x),
		);
		const toAddInCache = dbSummonPools.filter(
			(x) => !includes(cacheSummonPools, x),
		);

		// Delete old from cache
		for (let i = 0; i < toDeleteFromCache.length; i++) {
			await redisClient.DEL(`summonpool:${toDeleteFromCache[i]._id}`);
		}

		// Add new in cache
		for (let i = 0; i < toAddInCache.length; i++) {
			await redisClient.HSET(
				`summonpool:${toAddInCache[i]._id}`,
				'characters',
				JSON.stringify(toAddInCache[i].characters),
			);
			await redisClient.HSET(
				`summonpool:${toAddInCache[i]._id}`,
				'cost',
				toAddInCache[i].cost,
			);
			await redisClient.HSET(
				`summonpool:${toAddInCache[i]._id}`,
				'duration',
				toAddInCache[i].duration,
			);
		}

		await db.disconnect();
		await redisClient.quit();

		return dbSummonPools;
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error('Unable to get summon pools');
	}
};

const getSummonPoolInDB = async (id: string): Promise<SummonPool | null> => {
	try {
		await redisClient.connect();

		// Try to get it from db
		const db = await connectToDB();

		const summonPool: SummonPool | null | undefined =
			await SummonPoolModel.findById(id).populate('characters');

		await db.disconnect();

		// If it does not exists in DB, try delete it from cache
		if (!summonPool) {
			await redisClient.DEL(`summonpool:${id}`);
			return null;
		}

		// Get from cache
		const cacheSummonPool = await redisClient.HGETALL(`summonpool:${id}`);

		// If it does not exists in cache or if the cached one is not updated from DB
		if (
			(await redisClient.EXISTS(`summonpool:${id}`)) == 0 ||
			!isEqual(cacheSummonPool, summonPool)
		) {
			// Set in cache
			await redisClient.HSET(
				`summonpool:${id}`,
				'characters',
				JSON.stringify(summonPool.characters),
			);
			await redisClient.HSET(`summonpool:${id}`, 'cost', summonPool.cost);
			await redisClient.HSET(
				`summonpool:${id}`,
				'duration',
				summonPool.duration,
			);

			await redisClient.quit();
			return summonPool;
		}

		await redisClient.quit();
		return summonPool;
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
		const db = await connectToDB();

		const { _id } = await SummonPoolModel.create({
			characters,
			cost,
			duration,
		});

		const summonPool = await SummonPoolModel.findById(_id).populate(
			'characters',
		);

		await db.disconnect();

		return summonPool;
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error(`Unable to create Summon Pool`);
	}
};

const updateSummonPoolInDB = async (
	id: string,
	fields: Object,
): Promise<SummonPool | null> => {
	try {
		// Delete from cache
		await redisClient.connect();
		await redisClient.DEL(`summonpool:${id}`);
		await redisClient.disconnect();

		// Update in DB
		const db = await connectToDB();

		const summonPool: SummonPool | null | undefined =
			await SummonPoolModel.findByIdAndUpdate(id, fields, {
				new: true,
			}).populate('characters');

		await db.disconnect();

		return summonPool ? summonPool : null;
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error(`Unable to update summon pool with id: ${id}`);
	}
};

const deleteSummonPoolInDB = async (id: string): Promise<void> => {
	try {
		// Delete from cache
		await redisClient.connect();
		await redisClient.DEL(`summonpool:${id}`);
		await redisClient.quit();

		// Delete from DB
		const db = await connectToDB();
		SummonPoolModel.findByIdAndDelete(id);
		await db.disconnect();
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
