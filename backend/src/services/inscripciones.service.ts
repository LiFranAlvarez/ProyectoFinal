import Inscripciones from "../models/inscripciones";
import Usuario from '../models/usuario.schema';
import Curso from '../models/curso.schema';
import HttpError from '../utils/httpError';


class InscripcionService{
    async createOne( idCurso: string, idUser: string ){
        const inscripcionActiva = await Inscripciones.findOne({ 
            cursoId: idCurso, 
            usuarioId: idUser,
            estadoInscripcion: 'EN_PROCESO'
        });
        
        if (inscripcionActiva) {
            throw new HttpError("Ya estás inscripto en este curso.", 409); 
        }
        const inscripcionAbandonada = await Inscripciones.findOne({
            cursoId: idCurso,
            usuarioId: idUser,
            estadoInscripcion: 'ABANDONADA'
        });

        try {
            if (inscripcionAbandonada) {
                return await Inscripciones.findByIdAndUpdate(
                    inscripcionAbandonada._id,
                    { estadoInscripcion: 'EN_PROCESO' },
                    { new: true }
                );
            }

            // Si no existe, crear una nueva inscripción
            return await Inscripciones.create({
                cursoId: idCurso,
                usuarioId: idUser
            });
        } catch (error: any) {
            
            console.error("Error detallado de Mongoose en createOne:", error); 
            
            if (error.name === 'CastError') {
                throw new HttpError("IDs de Curso o Usuario inválidos. Verifique el formato.", 400); 
            }
            
            throw new HttpError("Fallo desconocido al crear la inscripción", 500);
        }
    };

    async cancelOne( idInsc: string ){
        try {
            const result = await Inscripciones.findByIdAndUpdate(idInsc, {estadoInscripcion : 'ABANDONADA'},{
                new : true
            })
            return result;
        } catch (error) {
            throw new HttpError("No se pudo cancelar inscripcion", 500);
        }
    };

    async abandonarCurso( cursoId: string, usuarioId: string ){
        try {
            const inscripcion = await Inscripciones.findOneAndUpdate(
                { cursoId: cursoId, usuarioId: usuarioId },
                { estadoInscripcion: 'ABANDONADA' },
                { new: true }
            );
            if (!inscripcion) {
                throw new HttpError("No se encontró inscripción", 404);
            }
            return inscripcion;
        } catch (error) {
            if (error instanceof HttpError) {
                throw error;
            }
            throw new HttpError("No se pudo abandonar el curso", 500);
        }
    };

    async finalizarCurso( cursoId: string ){
        try {
            const result = await Inscripciones.updateMany(
                { cursoId: cursoId, estadoInscripcion: 'EN_PROCESO' },
                { estadoInscripcion: 'TERMINADA' }
            );
            return result;
        } catch (error) {
            throw new HttpError("No se pudieron finalizar las inscripciones del curso", 500);
        }
    };

    async getUsers( idCurso:string ){
            try {
                if (!idCurso) {
                    throw new HttpError("El ID del curso es requerido", 400);
                }
                const inscripciones = await Inscripciones.find({ cursoId: idCurso }, 'usuarioId');
                if (!inscripciones.length) {
                    return [];
                }
                const userIDs = [...new Set(inscripciones.map(i => i.usuarioId))];
                 console.log(userIDs);
                const alumnosInscritos = await Usuario.find({
                    _id: { $in: userIDs },
                    rol: 'ALUMNO'
                }).select('nombre apellido email rol');
                return alumnosInscritos;
            } catch (error) {
                throw new HttpError("No se pudo obtener los usuarios del curso", 500); 
            }
    };

    async getCursos( idUser: string ){
        try {
            if (!idUser) {
                throw new HttpError("El ID del usuario es requerido", 400);
            }
            const inscripcionesCompletas = await Inscripciones.find({ usuarioId: idUser })
                .populate({
                    path: 'cursoId', 
                    select: 'titulo descripcion categorias estado profesor',
                    populate: {
                        path: 'profesor',
                        select: 'nombre'
                    }
                })
                .select('cursoId estadoInscripcion'); 
            
            return inscripcionesCompletas; 
            
        } catch (error) {
            throw new HttpError("No se pudo obtener las inscripciones del usuario", 500);
        }
    };
    async getAll(){
        try {
            return await Inscripciones.find().populate('cursoId', 'titulo _id');
        } catch (error) {
            
        }
    }
    
}
export default new InscripcionService();    