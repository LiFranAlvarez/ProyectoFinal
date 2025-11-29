import { Clase } from "./claseType";
import { Material } from "./materialType";
export type Curso = {
  _id?: string;
  titulo: string;
  descripcion?: string;
  estado?: "COMPLETADO" | "EN CURSO" | "PENDIENTE" | "CANCELADO";
  profesor?: { _id: string; nombre?: string } | string;
  clases?: Clase[];
  materiales?: Material[];
  categorias?: string[];
};