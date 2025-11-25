import { Usuario } from "./usuario.js";
import { Curso } from "./curso.js";

export class Docente extends Usuario {
  constructor(
    id: number,
    nombre: string,
    apellido: string,
    email: string,
    password: string,
    protected especialidad: string,
    protected rol: string = "docente",
    conectado: boolean = false,
    private cursosDictados: Curso[] = []
  ) {
    super(id, nombre, apellido, email, password, rol, conectado);
  }

  public crearCurso(curso: Curso): void {
    this.cursosDictados.push(curso);
    console.log(`${this.nombre} creó el curso: ${curso.getTitulo()}`);
  }

  public modificarCurso(idCurso: number, nuevoTitulo: string): void {
    const curso = this.cursosDictados.find(c => c.getId() === idCurso);
    if (curso) {
      curso.setTitulo(nuevoTitulo);
      console.log(`El curso ${idCurso} fue modificado por ${this.nombre}`);
    }
  }

  public eliminarCurso(idCurso: number): void {
    this.cursosDictados = this.cursosDictados.filter(c => c.getId() !== idCurso);
    console.log(`Curso eliminado por ${this.nombre}`);
  }
}
export default Docente ;