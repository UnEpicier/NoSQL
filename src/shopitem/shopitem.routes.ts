import { Router } from 'express';
import {
	getAllShopItems,
	getShopItem,
	createShopItem,
	updateShopItem,
	deleteShopItem,
} from './shopitem.controllers';

const router = Router();

router.get('/shopitems', getAllShopItems);
router.get('/shopitems/:id', getShopItem);

router.post('/shopitems', createShopItem);

router.patch('/shopitems/:id', updateShopItem);

router.delete('/shopitems/:id', deleteShopItem);

export default router;
