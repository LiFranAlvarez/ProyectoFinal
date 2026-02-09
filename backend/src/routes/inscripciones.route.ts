import { Router } from "express";
import inscripcionesController from "../controllers/inscripciones.controller";
import { verifyApiKey } from "../middlewares/authToken";
const inscripcionRouter = Router();

inscripcionRouter.put('/inscripcion/abandonar', verifyApiKey,inscripcionesController.abandonarCurso);
inscripcionRouter.get('/inscripcion',verifyApiKey, inscripcionesController.getAll)
inscripcionRouter.post('/inscripcion/:idCurso/:idUser',verifyApiKey, inscripcionesController.nuevaInscripcion);
inscripcionRouter.put('/inscripcion/cancel/:idInsc',verifyApiKey, inscripcionesController.cancelInscripcion);
inscripcionRouter.get('/inscripcion/curso/:idCurso', verifyApiKey,inscripcionesController.getUsersByCurso); 
inscripcionRouter.get('/inscripcion/user/:idUser',verifyApiKey, inscripcionesController.getCursoByUser);

export default inscripcionRouter;