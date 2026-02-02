import { EstadoCurso } from '../models/interfaces/types';

export interface CreateCursoDTO {
  titulo: string;
  descripcion?: string;
  estado?: EstadoCurso;
  profesor: string;
}

export interface UpdateCursoDTO extends Partial<CreateCursoDTO> {}
