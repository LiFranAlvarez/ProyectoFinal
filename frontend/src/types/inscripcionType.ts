import { Curso } from './cursoType'; 

export type EstadoInscripcion = "EN_PROCESO" | "ABANDONADA" | "TERMINADA";

export type Inscripcion = {
    _id: string;
    usuario: string;
    curso: Curso; // El objeto Curso completo (si usaste populate en el backend)
    estado: EstadoInscripcion; // 💡 ¡El campo de estado real!
    fechaInscripcion: string;
};
