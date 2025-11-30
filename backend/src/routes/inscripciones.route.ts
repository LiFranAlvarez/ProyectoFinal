import { Router } from "express";
import inscripcionesController from "../controllers/inscripciones.controller";
const inscripcionRouter = Router();
inscripcionRouter.post('/inscripcion/:idCurso/:idUser', inscripcionesController.nuevaInscripcion);
inscripcionRouter.put('/inscripcion/cancel/:idInsc', inscripcionesController.cancelInscripcion);
inscripcionRouter.get('/inscripcion/curso/:idCurso', inscripcionesController.getUsersByCurso); // busca los usuarios inscriptos a un curso
inscripcionRouter.get('/inscripcion/user/:idUser', inscripcionesController.getCursoByUser);
inscripcionRouter.get('/inscripcion', inscripcionesController.getAll)
export default inscripcionRouter;