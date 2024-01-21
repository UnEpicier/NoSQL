import { Router } from 'express';
import { createSummonPool, getAllSummonPools } from './summonpool.controllers';

const router = Router();

router.get('/summonpools', getAllSummonPools);

router.post('/summonpool', createSummonPool);

export default router;
