import Curso from '../models/curso.schema';
import { Types } from 'mongoose';
import HttpError from '../utils/httpError';
import "../models/clase.schema";
import "../models/material.schema"

export type EstadoCurso = 'COMPLETADO' | 'EN CURSO' | 'CANCELADO';

export interface ICurso {
    _id?: Types.ObjectId; 
    titulo: string; 
    descripcion: string; 
    estado: EstadoCurso; 
    profesor: Types.ObjectId; 
}

class CursosService {
    async getAll(): Promise<ICurso[]>{
        try {
            return await Curso.find();
        } catch (error) {
            throw new HttpError("Error DB buscando cursos (CursosService: getAll)", 500);
        }
    };
    async createOne( data : ICurso){ 
        try {
            const result = await Curso.create(data);
            return result;
        } catch (error) {
            throw new HttpError("No se pudo crear curso (CursosService.createOne)", 500);
        }
    }
    async updateOne( idCurso: string, data : ICurso) : Promise<ICurso | null>{
        try {
            const result = await Curso.findByIdAndUpdate(idCurso, data, {
                new : true,
                runValidators : true
            });
            return result as ICurso | null;
        } catch (error) {
            throw new HttpError("No se pudo actualizar service.UpdateOne", 500);
        }
    }
    async deleteOne( idCurso : string ){
        try {
            const deleted = await Curso.findByIdAndDelete(idCurso);
            return deleted;
        } catch (error) {
            throw new HttpError("No se pudo eliminar service.DeleteOne", 500);
        }
    };
    getById(idCurso: string) {
        return Curso.findById(idCurso)
            .populate("profesor")
            .populate("clases")
            .populate("materiales");
    }
    async getByProfesor(idProfesor: string) {
    try {
        const cursos = await Curso.find({ profesor: idProfesor })
        .populate("profesor", "nombre email")
        .exec();

        return cursos;
    } catch (error) {
        console.error("Error al obtener cursos por profesor", error);
        throw new Error("No se pudieron obtener los cursos del profesor");
    }
    }


}
export default new CursosService();

