import { Estudiante } from "./estudiante";
import { Docente } from './docente';
import { Update } from "./interface/update";


export class Curso {
  private observadores: Update[] = [];

  constructor(
    protected id: number,
    protected codigo: string,
    protected titulo: string,
    protected descripcion: string,
    protected categoria: string,
    protected fechaCreacion: Date,
    protected docente: Docente,
    private activo: boolean = true,
    private inscriptos: Estudiante[] = [],
    private lecciones: string[] = []
  ) {}

  
  public getId(): number { return this.id; }
  public getTitulo(): string { return this.titulo; }
  public setTitulo(titulo: string): void { this.titulo = titulo; }
  public getDescripcion(): string { return this.descripcion; }
  public getDocente(): Docente { return this.docente; }
  public isActivo(): boolean { return this.activo; }

  agregarObservador(estudiante: Estudiante): void {
    this.observadores.push(estudiante);
  }

  notificarObservadores(mensaje: string): void {
    this.observadores.forEach(e => e.update(mensaje));
  }

  public setActivo(estado: boolean): void {
    this.activo = estado;
  }

 
  public agregarLeccion(titulo: string): void {
    this.lecciones.push(titulo);
    console.log(`Lección "${titulo}" agregada al curso ${this.titulo}.`);
  }

  public listarLecciones(): void {
    console.log(`Lecciones del curso ${this.titulo}:`);
    this.lecciones.forEach(l => console.log(`- ${l}`));
  }

  public inscribirEstudiante(estudiante: Estudiante): void {
    if (!this.inscriptos.includes(estudiante)) {
      this.inscriptos.push(estudiante);
      console.log(`Estudiante ${estudiante.getNombre()} inscrito en ${this.titulo}.`);
    } else {
      console.warn(`El estudiante ya estaba inscripto en ${this.titulo}.`);
    }
  }

  public obtenerInscriptos(): void {
    console.log(`Alumnos en el curso ${this.titulo}:`);
    this.inscriptos.forEach(e => console.log(`- ${e.getNombre()}`));
  }
}
