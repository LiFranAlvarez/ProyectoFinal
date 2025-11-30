import { Router } from "express";
import CursosController from "../controllers/cursos.controller";
import * as auth from "../middlewares/authToken";
const cursoRouter = Router();

cursoRouter.get('/cursos' ,CursosController.listCursos); // array de cursos 
cursoRouter.get('/cursos/:idCurso',CursosController.getCursoById)
cursoRouter.get('/cursos/profesor/:idProfesor', auth.verifyToken, CursosController.getCursosByProfesor);
cursoRouter.post('/cursos',  CursosController.createCurso); // crear un curso
cursoRouter.put('/cursos/:idCurso',  CursosController.updateCurso); // edita un crso hay que pasarle el curso completo
cursoRouter.delete('/cursos/:idCurso',  CursosController.deleteCurso); // elimina un curso

export default cursoRouter;