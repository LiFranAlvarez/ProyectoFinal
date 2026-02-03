export interface ClaseDTO {
  titulo: string;
  descripcion?: string;
  fecha?: Date | string;
  linkGrabacion?: string;
  cursoId: string;
}

export type CreateClaseDTO = ClaseDTO | ClaseDTO[];
export type UpdateClaseDTO = Partial<ClaseDTO>;
