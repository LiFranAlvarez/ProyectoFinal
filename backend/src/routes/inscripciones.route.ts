import { Router } from "express";
import inscripcionesController from "../controllers/inscripciones.controller";
const inscripcionRouter = Router();

inscripcionRouter.put('/inscripcion/abandonar', inscripcionesController.abandonarCurso);
inscripcionRouter.get('/inscripcion', inscripcionesController.getAll)
inscripcionRouter.post('/inscripcion/:idCurso/:idUser', inscripcionesController.nuevaInscripcion);
inscripcionRouter.put('/inscripcion/cancel/:idInsc', inscripcionesController.cancelInscripcion);
inscripcionRouter.get('/inscripcion/curso/:idCurso', inscripcionesController.getUsersByCurso); 
inscripcionRouter.get('/inscripcion/user/:idUser', inscripcionesController.getCursoByUser);

export default inscripcionRouter;