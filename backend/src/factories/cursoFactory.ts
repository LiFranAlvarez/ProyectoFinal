import { EstadoCurso } from '../models/interfaces/types';

export interface CursoDTO {
  titulo: string;
  descripcion?: string;
  estado: EstadoCurso;
}

export class CursoFactory {
  static fromRequest(body: Record<string, unknown>): CursoDTO {
    return {
      titulo: typeof body.titulo === 'string' ? body.titulo : '',
      descripcion: typeof body.descripcion === 'string' ? body.descripcion : undefined,
      estado: (body.estado as EstadoCurso) ?? 'PENDIENTE',
    };
  }
}
