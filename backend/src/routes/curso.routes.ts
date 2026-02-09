import { Router } from "express";
import CursosController from "../controllers/cursos.controller";
import * as auth from "../middlewares/authToken";
import { verifyApiKey } from "../middlewares/authToken";

const cursoRouter = Router();

cursoRouter.get('/cursos' ,verifyApiKey,CursosController.listCursos);
cursoRouter.get('/cursos/:idCurso',verifyApiKey,CursosController.getCursoById)
cursoRouter.get('/cursos/profesor/:idProfesor',verifyApiKey, auth.verifyToken, CursosController.getCursosByProfesor);
cursoRouter.post('/cursos',verifyApiKey, auth.verifyToken, CursosController.createCurso);
cursoRouter.put('/cursos/:idCurso',verifyApiKey, auth.verifyToken, CursosController.updateCurso); 
cursoRouter.put('/cursos/finalizar-curso',verifyApiKey, auth.verifyToken, CursosController.finalizarCurso); 
cursoRouter.delete('/cursos/:idCurso',verifyApiKey, auth.verifyToken, CursosController.deleteCurso); 

export default cursoRouter;