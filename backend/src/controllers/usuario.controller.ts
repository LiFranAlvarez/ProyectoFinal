import { Request, Response } from "express";
import { Usuario } from "../models/usuario";
import { Elearning } from "../services/Elearning";

const facade = new Elearning();

export class UsuarioController {
  static getAll(req: Request, res: Response): void {
    res.status(200).json({ message: "Listado de usuarios (demo)" });
  }

  static getById(req: Request, res: Response): void {
    const { id } = req.params;
    res.status(200).json({ message: `Detalles del usuario con ID ${id}` });
  }

  static create(req: Request, res: Response): void {
    const { tipo, ...datos } = req.body;
    try {
      const nuevoUsuario = facade.crearUsuario(tipo, datos);
      res.status(201).json({
        message: `Usuario tipo ${tipo} creado exitosamente`,
        usuario: nuevoUsuario,
      });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  static update(req: Request, res: Response): void {
    const { id } = req.params;
    res.status(200).json({ message: `Usuario ${id} actualizado (demo)` });
  }

  static delete(req: Request, res: Response): void {
    const { id } = req.params;
    res.status(200).json({ message: `Usuario ${id} eliminado (demo)` });
  }
}
