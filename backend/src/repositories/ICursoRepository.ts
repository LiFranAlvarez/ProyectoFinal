import { ICurso } from '../services/curso.service';

export interface ICursoRepository {
  findAll(): Promise<ICurso[]>;
  findByProfesor(idProfesor: string): Promise<ICurso[]>;
  create(data: ICurso): Promise<ICurso>;
  update(idCurso: string, data: ICurso): Promise<ICurso | null>;
  delete(idCurso: string): Promise<void>;
  getById(idCurso: string): Promise<ICurso | null>;
}
