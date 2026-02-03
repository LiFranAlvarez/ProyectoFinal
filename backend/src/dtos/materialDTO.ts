import { TipoContenido } from '../models/interfaces/types';
export interface MaterialDTO {
  titulo: string;
  url: string;
  tipo: TipoContenido;
  claseId: string;
  descripcion?: string;
}

export type CreateMaterialDTO = MaterialDTO | MaterialDTO[];
export type UpdateMaterialDTO = Partial<MaterialDTO>;
