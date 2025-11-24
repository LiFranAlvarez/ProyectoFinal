import { Usuario } from "../models/usuario";
import { Curso } from "../models/curso";

export class Elearning {
  crearUsuario(tipo: string, datos: any): Usuario {
    return Usuario.crearUsuario(tipo, datos);
  }

  crearCurso(datos: any): Curso {
    return new Curso(
      datos.id,
      datos.codigo,
      datos.titulo,
      datos.descripcion,
      datos.categoria,
      new Date(),
      datos.docente
    );
  }

  inscribirEstudiante(curso: Curso, estudiante: any): void {
    curso.inscribirEstudiante(estudiante);
  }
}
