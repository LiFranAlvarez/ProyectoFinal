import { Curso } from './cursoType'; 

export type EstadoInscripcion = "EN_PROCESO" | "ABANDONADA" | "TERMINADA";

export type Inscripcion = {
    _id: string;
    usuario: string;
    curso: Curso; 
    estado: EstadoInscripcion; 
    fechaInscripcion: string;
};
