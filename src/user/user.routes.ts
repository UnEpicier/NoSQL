import { Router } from 'express';
import {
	getAllUsers,
	getUser,
  getUserCurrency,
  getUserRoster,
  getUserRank,
	createUser,
	updateUser,
  updateUserCurrency,
  updateUserRoster,
  updateUserRank,
	deleteUser,
} from './user.controllers';

const router = Router();

router.get('/users', getAllUsers);
router.get('/user/:id', getUser);
router.get('/user/:id/currency', getUserCurrency);
router.get('/user/:id/roster', getUserRoster);
router.get('/user/:id/rank', getUserRank);

router.post('/user', createUser);

router.patch('/user/:id', updateUser);
router.get('/user/:id/currency', updateUserCurrency);
router.get('/user/:id/roster', updateUserRoster);
router.get('/user/:id/rank', updateUserRank);

router.delete('/user/:id', deleteUser);

export default router;
