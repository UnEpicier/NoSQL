import { Router } from 'express';
import {
	createSummonPool,
	getAllSummonPools,
	getSummonPool,
	updateSummonPool,
} from './summonpool.controllers';

const router = Router();

router.get('/summonpools', getAllSummonPools);
router.get('/summonpool/:id', getSummonPool);

router.post('/summonpool', createSummonPool);

router.patch('/summonpool/:id', updateSummonPool);

export default router;
