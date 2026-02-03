import { Router } from 'express';

import {
  getClases,
  getClaseById,
  createClase,
  updateClase,
  deleteClase,
} from '../controllers/clase.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorizeCursoEdit } from '../middlewares/authorizeCurso';
import { authorizeRole } from '../middlewares/authorizeRole';

const router = Router();

router.get('/', getClases);
router.get('/:id', getClaseById);
router.post('/', authenticate, authorizeRole('ADMIN', 'PROFESOR'), createClase);
router.put('/:id', authenticate, authorizeCursoEdit, updateClase);
router.delete('/:id', authenticate, authorizeRole('ADMIN'), deleteClase);

export default router;
