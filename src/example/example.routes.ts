import { Router } from 'express';
import { getHelloWorld } from './example.controllers';

const router = Router();

router.get('/', getHelloWorld);

export default router;
