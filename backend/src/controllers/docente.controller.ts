import { Request, Response } from "express";
import { Docente } from "../models/docente";
import { MultipleChoiceStrategy, EnsayoStrategy } from "../models/docente";

export class DocenteController {
  static getAll(req: Request, res: Response): void {
    res.status(200).json({ message: "Listado de docentes (demo)" });
  }

  static getById(req: Request, res: Response): void {
    const { id } = req.params;
    res.status(200).json({ message: `Detalles del docente con ID ${id}` });
  }

  static evaluar(req: Request, res: Response): void {
    const { tipoEvaluacion, respuestas, docente } = req.body;

    const prof = new Docente(
      docente.id,
      docente.nombre,
      docente.apellido,
      docente.email,
      docente.password,
      docente.especialidad
    );

    if (tipoEvaluacion === "multiple") {
      prof.setEstrategia(new MultipleChoiceStrategy());
    } else {
      prof.setEstrategia(new EnsayoStrategy());
    }

    const nota = prof.evaluar(respuestas);
    res.status(200).json({ message: `Evaluación completada`, nota });
  }
}
