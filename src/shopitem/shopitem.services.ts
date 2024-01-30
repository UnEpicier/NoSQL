import redisClient from '@utils/redis';
import { ShopItem } from '../types/shopItem';
import ShopItemModel from '@models/ShopItem';
import { connectToDB } from '@utils/database';

const getAllShopItemsInDB = async (): Promise<ShopItem[]> => {
	try {
		// Get all stored shop items in DB
		const db = await connectToDB();
		const dbShopItem: ShopItem[] = await ShopItemModel.find({});

		await redisClient.connect();
		// Add new in cache
		for (let i = 0; i < dbShopItem.length; i++) {
			await redisClient.HSET(`shopitem:${dbShopItem[i]._id}`, 'cost', dbShopItem[i].cost);
			await redisClient.HSET(`shopitem:${dbShopItem[i]._id}`, 'sprite', dbShopItem[i].sprite);
		}

		await db.disconnect();
		await redisClient.quit();

		return dbShopItem;
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error('Unable to get shop items');
	}
};

const getShopItemInDB = async (id: string): Promise<ShopItem | null> => {
	if (id.length != 24) {
		return null;
	}
	try {
		// Get from cache
		await redisClient.connect();
		if ((await redisClient.EXISTS(`shopitem:${id}`)) == 0) {
			// Try to get it from db
			redisClient.quit();
			const db = await connectToDB();
			const shopItem: ShopItem | null | undefined = await ShopItemModel.findById(id);
			await db.disconnect();
			return shopItem ? shopItem : null;
		}
		const cacheShopItem = await redisClient.HGETALL(`shopitem:${id}`);
		await redisClient.quit();
		const shopItem: ShopItem = {
			_id: id,
			cost: parseFloat(cacheShopItem.cost),
			sprite: cacheShopItem.sprite,
		};
		return shopItem ? shopItem : null;
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error(`Unable to get shop item with id: ${id}`);
	}
};

const createShopItemInDB = async (cost: number, sprite: string): Promise<ShopItem> => {
	try {
		const db = await connectToDB();

		const { _id } = await ShopItemModel.create({
			cost,
			sprite,
		});

		const shopItem = await ShopItemModel.findById(_id);

		await db.disconnect();

		return shopItem;
	} catch (error) {
		console.error(error);

		throw Error(`Unable to create shop item`);
	}
};

const updateShopItemInDB = async (id: string, cost: number, sprite: string): Promise<ShopItem | null> => {
	try {
		// Delete from cache
		await redisClient.connect();
		await redisClient.DEL(`shopitem:${id}`);
		await redisClient.disconnect();

		// Update in DB
		const db = await connectToDB();

		const shopItem: ShopItem | null | undefined = await ShopItemModel.findByIdAndUpdate(
			id,
			{ cost, sprite },
			{
				new: true,
			},
		);

		await db.disconnect();

		return shopItem ? shopItem : null;
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error(`Unable to update shop item with id: ${id}`);
	}
};

const deleteShopItemInDB = async (id: string): Promise<void> => {
	try {
		// Delete from cache
		await redisClient.connect();
		await redisClient.DEL(`shopitem:${id}`);
		await redisClient.quit();

		// Delete from DB
		const db = await connectToDB();
		ShopItemModel.findByIdAndDelete(id);
		await db.disconnect();
	} catch (error) {
		console.error(error);
		await redisClient.quit();

		throw Error(`Unable to delete shop item with id: ${id}`);
	}
};

export { createShopItemInDB, deleteShopItemInDB, getAllShopItemsInDB, getShopItemInDB, updateShopItemInDB };
