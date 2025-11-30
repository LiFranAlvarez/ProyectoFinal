import Inscripciones from "../models/inscripciones";
import Usuario from '../models/usuario.schema';
import Curso from '../models/curso.schema';
import HttpError from '../utils/httpError';


class InscripcionService{
    async createOne( idCurso: string, idUser: string ){
        const existing = await Inscripciones.findOne({ cursoId: idCurso, usuarioId: idUser });
        if (existing) {
            throw new HttpError("Ya estás inscripto en este curso.", 409); 
        }

        try {
            return await Inscripciones.create({
                cursoId: idCurso,
                usuarioId: idUser
            });;
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
            const result = Inscripciones.findByIdAndUpdate(idInsc, {estadoInscripcion : 'CANCELADA'},{
                new : true
            })
            return result;
        } catch (error) {
            throw new HttpError("No se pudo cancelar inscripcion", 500);
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
                    select: 'titulo estado profesor' 
                })
                .select('cursoId estadoInscripcion'); 
            
            return inscripcionesCompletas; 
            
        } catch (error) {
            throw new HttpError("No se pudo obtener las inscripciones del usuario", 500);
        }
    };
    async getAll(){
        try {
            return await Inscripciones.find();
        } catch (error) {
            
        }
    }
    
}
export default new InscripcionService();    