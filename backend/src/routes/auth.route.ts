import { Router } from 'express';
import { signInController, refreshTokenController } from '../controllers/auth.controller';

const router = Router();

router.post('/signin', signInController);
router.post('/refresh', refreshTokenController); // Nuevo endpoint

export default router;