import { v4 } from 'uuid';
import redisClient from '@utils/redis';
import { ShopItem } from '../types/shopItem';

const getAllShopItemsInDB = async (): Promise<ShopItem[]> => {
	try {
		await redisClient.connect();

		const matchingKeys = await redisClient.KEYS('shopitem:*');

		const shopItems: ShopItem[] = await Promise.all(
			matchingKeys.map(async (key) => {
				const result = await redisClient.HGETALL(key);

				return {
					id: key,
					cost: parseInt(result.cost),
					sprite: result.sprite,
				};
			}),
		);

		await redisClient.quit();

		return shopItems;
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error('Unable to get shop items');
	}
};

const getShopItemInDB = async (id: string): Promise<ShopItem | null> => {
	try {
		const key = id.includes('shopitem:') ? id : `shopitem:${id}`;

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
			cost: parseInt(result.cost),
			sprite: result.sprite,
		};
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error(`Unable to get shop item with id: ${id}`);
	}
};

const createShopItemInDB = async (
	cost: number,
	sprite: string,
): Promise<ShopItem> => {
	try {
		const key = `shopitem:${v4()}`;

		await redisClient.connect();

		await redisClient.HSET(key, 'cost', cost);
		await redisClient.HSET(key, 'sprite', sprite);

		await redisClient.quit();

		return {
			id: key,
			cost: cost,
			sprite: sprite,
		};
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error('Unable to create shop item');
	}
};

const updateShopItemInDB = async (
	id: string,
	cost: number,
	sprite: string,
): Promise<ShopItem> => {
	try {
		await redisClient.connect();

		const key = id.includes('shopitem:') ? id : `shopitem:${id}`;

		if (cost) {
			await redisClient.HSET(key, 'cost', cost);
		}

		if (sprite) {
			await redisClient.HSET(key, 'sprite', sprite);
		}

		const result = await redisClient.HGETALL(key);

		await redisClient.quit();

		return {
			id: key,
			cost: parseInt(result.cost),
			sprite: result.sprite,
		};
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error(`Unable to update shop item with id: ${id}`);
	}
};

const deleteShopItemInDB = async (id: string) => {
	try {
		const key = id.includes('shopitem:') ? id : `shopitem:${id}`;

		await redisClient.connect();

		await redisClient.DEL(key);

		await redisClient.quit();

		return;
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error(`Unable to delete shop item with id: ${id}`);
	}
};

export {
	createShopItemInDB,
	deleteShopItemInDB,
	getAllShopItemsInDB,
	getShopItemInDB,
	updateShopItemInDB,
};
