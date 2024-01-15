import { Router } from 'express';

// ----------------------------------------------------- Router --------------------------------------------------------
const router = Router();

router.get('/', (_, res) => {
	res.send('Hello world!');

	return;
});

export default router;
