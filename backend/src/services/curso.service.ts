import { Types } from 'mongoose';

import { EstadoCurso } from '../models/interfaces/types';
import { ICursoRepository } from '../repositories/ICursoRepository';
import HttpError from '../utils/httpError';

export interface ICurso {
  _id?: Types.ObjectId;
  titulo: string;
  descripcion: string;
  estado: EstadoCurso;
  profesor: Types.ObjectId;
}

export class CursosService {
  constructor(private readonly repo: ICursoRepository) {}
  getById(idCurso: string) {
    return this.repo.getById(idCurso);
  }
  getAll() {
    return this.repo.findAll();
  }

  getByProfesor(idProfesor: string) {
    return this.repo.findByProfesor(idProfesor);
  }

  createOne(data: ICurso) {
    return this.repo.create(data);
  }

  async updateOne(idCurso: string, data: ICurso) {
    const curso = await this.repo.update(idCurso, data);
    if (!curso) {
      throw new HttpError('Curso no encontrado', 404);
    }
    return curso;
  }

  deleteOne(idCurso: string) {
    return this.repo.delete(idCurso);
  }
}
