import { Request, Response } from "express";
import { Estudiante } from "../models/estudiante";
import { Curso } from "../models/curso";

export class EstudianteController {
  static getAll(req: Request, res: Response): void {
    res.status(200).json({ message: "Listado de estudiantes (demo)" });
  }

  static getById(req: Request, res: Response): void {
    const { id } = req.params;
    res.status(200).json({ message: `Detalles del estudiante con ID ${id}` });
  }

  static inscribir(req: Request, res: Response): void {
    const { curso, estudiante } = req.body;

    const nuevoCurso = new Curso(
      curso.id,
      curso.codigo,
      curso.titulo,
      curso.descripcion,
      curso.categoria,
      new Date(),
      curso.docente
    );

    const nuevoEstudiante = new Estudiante(
      estudiante.id,
      estudiante.nombre,
      estudiante.apellido,
      estudiante.email,
      estudiante.password,
      estudiante.legajo
    );

    nuevoCurso.inscribirEstudiante(nuevoEstudiante);

    res.status(200).json({
      message: `${estudiante.nombre} inscrito en el curso ${curso.titulo}`,
    });
  }

  static viewProgress(req: Request, res: Response): void {
    const { id } = req.params;
    res.status(200).json({ message: `Progreso del estudiante ${id} (demo)` });
  }
}
