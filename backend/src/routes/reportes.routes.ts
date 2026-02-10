import { Router } from 'express';
import { descargarReporte } from '../controllers/reportes.controller';
import { verifyApiKey, verifyToken, isAdmin } from '../middlewares/authToken';

const router = Router();

router.get('/:tipo/:formato', verifyApiKey, verifyToken, isAdmin, descargarReporte);

export default router;