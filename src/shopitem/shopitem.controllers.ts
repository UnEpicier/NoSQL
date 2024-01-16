import { Request, Response } from 'express';
import {
	getAllShopItemsDB,
	getShopItemDB,
	createShopItemDB,
	updateShopItemDB,
	deleteShopItemDB,
} from './shopitem.services';

const getAllShopItems = async (_: Request, res: Response) => {
	try {
		const shopItems = await getAllShopItemsDB();

		if (shopItems.length > 0) {
			res.status(200).send(shopItems);
			return;
		}

		res.status(204).send([]);
		return;
	} catch (error) {
		res.status(500).end();
		return;
	}
};

const getShopItem = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const shopItem = await getShopItemDB(id);

		if (!shopItem) {
			res.status(404).end();
			return;
		}

		res.status(200).send(shopItem);
		return;
	} catch (error) {
		res.status(500).end();
		return;
	}
};

const createShopItem = async (req: Request, res: Response) => {
	const { cost, sprite } = req.body || {};

	if (!cost || !sprite) {
		res.status(400).send('Missing field(s) in request body.');
		return;
	}

	try {
		const shopItem = await createShopItemDB(cost, sprite);

		res.status(200).send(shopItem);
		return;
	} catch (error) {
		res.status(500).end();
		return;
	}
};

const updateShopItem = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { cost, sprite } = req.body || {};

	if (!cost && !sprite) {
		res.status(400).send('Missing field(s) in request body');
		return;
	}

	try {
		const shopItem = await updateShopItemDB(id, cost, sprite);

		res.status(200).send(shopItem);
		return;
	} catch (error) {
		res.status(500).end();
		return;
	}
};

const deleteShopItem = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		await deleteShopItemDB(`${id}`);
		res.status(200).end();
		return;
	} catch (error) {
		res.status(500).end();
		return;
	}
};

export {
	getAllShopItems,
	getShopItem,
	createShopItem,
	updateShopItem,
	deleteShopItem,
};
