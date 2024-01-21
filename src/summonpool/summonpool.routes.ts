import { Router } from 'express';
import { createSummonPool } from './summonpool.controllers';

const router = Router();

router.post('/summonpool', createSummonPool);

export default router;
