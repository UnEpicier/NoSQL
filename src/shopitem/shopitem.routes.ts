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
router.get('/shopitem/:id', getShopItem);

router.post('/shopitem', createShopItem);

router.patch('/shopitem/:id', updateShopItem);

router.delete('/shopitem/:id', deleteShopItem);

export default router;
