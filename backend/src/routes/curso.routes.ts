import { Router } from "express";
import CursosController from "../controllers/cursos.controller";
import * as auth from "../middlewares/authToken";
const cursoRouter = Router();

cursoRouter.get('/' ,CursosController.listCursos);
cursoRouter.get('/:idCurso',CursosController.getCursoById)
cursoRouter.get('/profesor/:idProfesor', auth.verifyToken, CursosController.getCursosByProfesor);
cursoRouter.post('/', auth.verifyToken, CursosController.createCurso);
cursoRouter.put('/:idCurso', auth.verifyToken, CursosController.updateCurso); 
cursoRouter.put('/finalizar-curso', auth.verifyToken, CursosController.finalizarCurso); 
cursoRouter.delete('/:idCurso', auth.verifyToken, CursosController.deleteCurso); 

export default cursoRouter;