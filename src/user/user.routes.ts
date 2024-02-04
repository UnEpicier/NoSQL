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
router.get('/users/:id', getUser);
router.get('/users/:id/currency', getUserCurrency);
router.get('/users/:id/roster', getUserRoster);
router.get('/users/:id/rank', getUserRank);

router.post('/users', createUser);

router.patch('/users/:id', updateUser);
router.patch('/users/:id/currency', updateUserCurrency);
router.patch('/users/:id/roster', updateUserRoster);
router.patch('/users/:id/rank', updateUserRank);

router.delete('/users/:id', deleteUser);

export default router;
