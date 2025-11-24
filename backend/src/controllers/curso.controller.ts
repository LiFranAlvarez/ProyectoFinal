import { Request, Response } from "express";
import { Elearning } from "../services/Elearning";

const facade = new Elearning();

export class CursoController {
  static getAll(req: Request, res: Response): void {
    res.status(200).json({ message: "Listado de cursos (demo)" });
  }

  static getById(req: Request, res: Response): void {
    const { id } = req.params;
    res.status(200).json({ message: `Detalles del curso con ID ${id}` });
  }

  static create(req: Request, res: Response): void {
    try {
      const curso = facade.crearCurso(req.body);
      res.status(201).json({
        message: "Curso creado exitosamente",
        curso,
      });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static update(req: Request, res: Response): void {
    const { id } = req.params;
    res.status(200).json({ message: `Curso ${id} actualizado (demo)` });
  }

  static delete(req: Request, res: Response): void {
    const { id } = req.params;
    res.status(200).json({ message: `Curso ${id} eliminado (demo)` });
  }
}
