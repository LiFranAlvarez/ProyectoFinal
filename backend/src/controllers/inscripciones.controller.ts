import { Request, Response } from "express";
import InscripcionesService from "../services/inscripciones.service";
import inscripcionesService from "../services/inscripciones.service";
import HttpError from '../utils/httpError';
class InscripcionesController{
    async nuevaInscripcion( req: Request, res: Response ){
        try {
            const { idCurso, idUser} = req.params;
            console.log("Inscripción solicitada para:", idCurso, idUser); // Log de los IDs recibidos
            const result = await InscripcionesService.createOne(idCurso, idUser);
            
            // ... (manejo de result === null)
            
            res.status(201).json(result);
        } catch (error) {
            if (error instanceof HttpError) {
                return res.status(error.status).json({message : error.message})
            }
            
            console.error("Error no clasificado en Controller:", error);
            res.status(500).json({ error: "Error interno del servidor." }); 
        }
    };
    async cancelInscripcion( req: Request, res: Response ){
        try {
            const { idInsc } = req.params;
            const result = await InscripcionesService.cancelOne(idInsc);
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof HttpError) {
                return res.status(error.status).json({message : error.message})
            }
            console.error(error);
            res.status(400).json(error);
        }
    };
    async getUsersByCurso( req: Request, res: Response ){
        try {
            const idCurso = req.params.idCurso;
            const result = await InscripcionesService.getUsers(idCurso);
            console.log(result);
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof HttpError) {
                return res.status(error.status).json({message : error.message})
            }
            console.error(error);
            res.status(400).json(error);
        }
    };
    async getCursoByUser( req: Request, res: Response ){
        try {
            const idUser = req.params.idUser;
            const result = await InscripcionesService.getCursos(idUser);
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof HttpError) {
                return res.status(error.status).json({message : error.message})
            }
            console.error(error);
            res.status(400).json(error);
        }
    };
    async getAll( req: Request, res: Response){
        try {
            const result = await inscripcionesService.getAll();
            res.status(200).json(result);
        } catch (error) {
            
        }
    };
}
export default new InscripcionesController();