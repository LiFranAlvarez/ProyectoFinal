import { Usuario } from "./usuario";
import { Curso } from "./curso";
import { Update } from "./interface/update";

export class Estudiante extends Usuario {
  constructor(
    id: number,
    nombre: string,
    apellido: string,
    email: string,
    password: string,
    protected legajo: string,
    protected rol: string = "estudiante",
    conectado: boolean = false,
    private cursosInscriptos: Curso[] = []
  ) {
    super(id, nombre, apellido, email, password, rol, conectado);
  }

  public update(mensaje: string): void {
    console.log(`Notificación para ${this.getNombre()}: ${mensaje}`);
  }

  public inscribirseCurso(curso: Curso): void {
    if (!this.cursosInscriptos.includes(curso)) {
      this.cursosInscriptos.push(curso);
      curso.inscribirEstudiante(this);
      console.log(`${this.nombre} se inscribió en el curso: ${curso.getTitulo()}`);
    } else {
      console.warn(`El estudiante ${this.nombre} ya está inscripto.`);
    }
  }

  public verProgreso(): void {
    console.log(`${this.nombre} revisa su progreso en los cursos.`);
  }
}
