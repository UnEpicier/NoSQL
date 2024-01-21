import { Router } from 'express';
import {
	createSummonPool,
	getAllSummonPools,
	getSummonPool,
} from './summonpool.controllers';

const router = Router();

router.get('/summonpools', getAllSummonPools);
router.get('/summonpool/:id', getSummonPool);

router.post('/summonpool', createSummonPool);

export default router;
