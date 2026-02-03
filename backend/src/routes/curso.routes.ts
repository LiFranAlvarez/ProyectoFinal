import { Router } from 'express';

import * as CursosController from '../controllers/cursos.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorizeCursoEdit } from '../middlewares/authorizeCurso';
import { authorizeRole } from '../middlewares/authorizeRole';
const cursoRouter = Router();

cursoRouter.get('/cursos', CursosController.listCursos);
cursoRouter.get('/cursos/:idCurso', CursosController.getCursoById);
cursoRouter.get('/cursos/profesor/:idProfesor', CursosController.getCursosByProfesor);
cursoRouter.post(
  '/cursos',
  authenticate,
  authorizeRole('ADMIN', 'PROFESOR'),
  CursosController.crearCurso
); 
cursoRouter.put('/cursos/:idCurso', authenticate, authorizeCursoEdit, CursosController.updateCurso); 
cursoRouter.delete(
  '/cursos/:idCurso',
  authenticate,
  authorizeRole('ADMIN'),
  CursosController.deleteCurso
); 
export default cursoRouter;
