import { Usuario } from "./usuario";
import { Curso } from "./curso";
import { evaluacionStrategy } from "./interface/evaluacionStrategy";

export interface EvaluacionStrategy {
  evaluar(respuestas: any): number;
}

export class MultipleChoiceStrategy implements EvaluacionStrategy {
  evaluar(respuestas: any): number {
    // Por ejemplo: calcula la nota según respuestas correctas / total
    return (respuestas.correctas / respuestas.total) * 10;
  }
}

export class EnsayoStrategy implements EvaluacionStrategy {
  evaluar(respuestas: any): number {
    // Ejemplo simple: nota según longitud o calidad del ensayo
    return respuestas.longitud > 500 ? 10 : 6;
  }
}

export class Docente extends Usuario {
  private estrategiaEvaluacion?: evaluacionStrategy;
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

  setEstrategia(estrategia: evaluacionStrategy): void {
    this.estrategiaEvaluacion = estrategia;
  }

  evaluar(respuestas: any): number {
    if (!this.estrategiaEvaluacion) {
      throw new Error("Estrategia de evaluación no definida.");
    }
    const nota = this.estrategiaEvaluacion.evaluar(respuestas);
    console.log(`Evaluación realizada por ${this.nombre}. Nota: ${nota}`);
    return nota;
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
