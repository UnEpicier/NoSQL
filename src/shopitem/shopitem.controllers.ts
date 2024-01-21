import { Request, Response } from 'express';
import {
	getAllShopItemsInDB,
	getShopItemInDB,
	createShopItemInDB,
	updateShopItemInDB,
	deleteShopItemInDB,
} from './shopitem.services';

const getAllShopItems = async (_: Request, res: Response) => {
	try {
		const shopItems = await getAllShopItemsInDB();

		if (shopItems.length > 0) {
			res.status(200).send(shopItems);
			return;
		}

		res.status(204).send([]);
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

const getShopItem = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const shopItem = await getShopItemInDB(id);

		if (!shopItem) {
			res.status(404).end();
			return;
		}

		res.status(200).send(shopItem);
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

const createShopItem = async (req: Request, res: Response) => {
	const { cost, sprite } = req.body || {};

	if (!cost || !sprite) {
		res.status(400).send('Missing field(s) in request body.');
		return;
	}

	if (!parseInt(cost)) {
		res.status(422).send('Wrong field(s) type in request body');
		return;
	}

	try {
		const shopItem = await createShopItemInDB(cost, sprite);

		res.status(200).send(shopItem);
		return;
	} catch (error) {
		res.status(500).send(error);
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

	if (cost && !parseInt(cost)) {
		res.status(422).send('Wrong field(s) type in request body');
		return;
	}

	try {
		const shopItem = await updateShopItemInDB(id, cost, sprite);

		res.status(200).send(shopItem);
		return;
	} catch (error) {
		res.status(500).send(error);
		return;
	}
};

const deleteShopItem = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		await deleteShopItemInDB(`${id}`);
		res.status(200).end();
		return;
	} catch (error) {
		res.status(500).send(error);
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
