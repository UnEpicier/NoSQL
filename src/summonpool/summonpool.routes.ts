import { Router } from 'express';
import {
	createSummonPool,
	getAllSummonPools,
	getSummonPool,
	updateSummonPool,
	deleteSummonPool,
} from './summonpool.controllers';

const router = Router();

router.get('/summonpools', getAllSummonPools);
router.get('/summonpool/:id', getSummonPool);

router.post('/summonpool', createSummonPool);

router.patch('/summonpool/:id', updateSummonPool);

router.delete('/summonpool/:id', deleteSummonPool);

export default router;
