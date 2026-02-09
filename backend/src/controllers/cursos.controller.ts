import  CursosService from '../services/curso.service'
import HttpError from '../utils/httpError';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import userService from '../services/user.service';
import InscripcionesService from '../services/inscripciones.service';

class CursosController{
    async listCursos(req: Request, res:Response){
        try {
            const result = await CursosService.getAll();
            if (!result) {
                return res.status(200).json({message : 'No hay cursos cargados'});
            }
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof HttpError) {
                return res.status(error.status).json({message : error.message})
            }
            console.error(error);
            res.status(400).json(error);
        }
    };
    async getCursoById(req: Request, res: Response) {
        try {
            const {idCurso}=req.params;
            if(!mongoose.Types.ObjectId.isValid(idCurso)){
                return res.status(400).json({message:"ID inválido"})
            }
            const curso = await CursosService.getById(req.params.idCurso).populate("profesor");

            if (!curso) 
                return res.status(404).json({ message: "Curso no encontrado" });

            return res.status(200).json(curso);

        } catch (error) {
            console.error("Error en getCursoById",error);
            return res.status(500).json({ message: "Error al obtener el curso" });
        }
    }

    async createCurso(req: Request, res: Response) {
        try {
            const data = req.body;
            console.log(data)
            const profesorId = typeof data.profesor === "object" && data.profesor.$oid 
            ? data.profesor.$oid 
            : data.profesor;

            if (!mongoose.Types.ObjectId.isValid(profesorId)) {
            throw new HttpError("El id del profesor no es válido (CursoController.createCurso)", 400);
            }
            console.log("Profesor id recibido", profesorId)
            const profesor = await userService.getOneUser(profesorId);
            console.log("Profesor encontrado:", profesor);

            if (!profesor || profesor.rol !== "PROFESOR") {
            throw new HttpError("Al crear un curso se le debe asignar un usuario con rol: PROFESOR", 400);
            }

            const result = await CursosService.createOne({
            ...data,
            profesor: profesorId 
            });

            res.status(201).json(result);
        } catch (error) {
            if (error instanceof HttpError) {
            return res.status(error.status).json({ message: error.message });
            }
            console.error(error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    async updateCurso( req: Request, res: Response){
        try {
            const idCurso = req.params.idCurso;
            const data = req.body
            const result = await CursosService.updateOne(idCurso, data);
            if (result === null) {
                return res.status(500).json({message : 'No se pudo actualizar el curso'})
            }
            res.status(200).json({message : 'actualizado', datos : result});
        } catch (error) {
            if (error instanceof HttpError) {
                return res.status(error.status).json({message : error.message})
            }
            console.error(error);
            res.status(400).json(error);
        }
    };
    async deleteCurso( req: Request, res: Response){
        try {
            const idCurso = req.params.idCurso;
            const result = await CursosService.deleteOne(idCurso);
            if (!result) {
                return res.status(200).json({message : 'No se encontro curso para eliminar'})
            }
            return res.status(200).json({message : `Curso id: ${idCurso} ELIMINADO`, curso : result})
        } catch (error) {
            if (error instanceof HttpError) {
                return res.status(error.status).json({message : error.message})
            }
            console.error(error);
            res.status(400).json(error);
        }
    }
    async getCursosByProfesor(req: Request, res: Response){
        try {
            const idProfesor = req.params.idProfesor;
            const result = await CursosService.getByProfesor(idProfesor);
            if (!result) return res.status(200).json({ message: 'No hay cursos para este profesor' });
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof HttpError) {
                return res.status(error.status).json({message : error.message})
            }
            console.error(error);
            res.status(400).json(error);
        }
    }

    async finalizarCurso(req: Request, res: Response){
        try {
            const { idCurso } = req.body;
            const idProfesor = (req as any).user?._id;

            if (!idCurso) {
                return res.status(400).json({message : "Se requiere idCurso"});
            }

            // Verificar que el curso existe y que el usuario es el profesor
            const curso = await CursosService.getById(idCurso);
            if (!curso) {
                return res.status(404).json({message : "Curso no encontrado"});
            }

            const profesorId = typeof curso.profesor === 'object' ? curso.profesor._id : curso.profesor;
            
            if (profesorId.toString() !== idProfesor) {
                return res.status(403).json({message : "No tienes permiso para finalizar este curso"});
            }

            // Actualizar el estado del curso a COMPLETADO
            const cursoActualizado = await CursosService.updateOne(idCurso, { estado:'COMPLETADO' } as any);

            // Marcar todas las inscripciones EN_PROCESO como TERMINADA
            await InscripcionesService.finalizarCurso(idCurso);

            res.status(200).json({ 
                message: 'Curso finalizado exitosamente',
                curso: cursoActualizado 
            });
        } catch (error) {
            if (error instanceof HttpError) {
                return res.status(error.status).json({message : error.message})
            }
            console.error(error);
            res.status(500).json({message: "Error al finalizar el curso"});
        }
    }
}
export default new CursosController();