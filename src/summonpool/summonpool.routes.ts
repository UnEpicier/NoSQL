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
router.get('/summonpools/:id', getSummonPool);

router.post('/summonpools', createSummonPool);

router.patch('/summonpools/:id', updateSummonPool);

router.delete('/summonpools/:id', deleteSummonPool);

export default router;
