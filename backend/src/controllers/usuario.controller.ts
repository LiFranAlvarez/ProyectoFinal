import { Request, Response } from "express";
import { UsuarioRepository } from "../repositories/usuario.repositories";
import { Usuario } from "../models/usuario";

const usuarioRepo = new UsuarioRepository();

export class UsuarioController {
  /** Obtener todos los usuarios */
  async getAll(req: Request, res: Response) {
    try {
      const usuarios = await usuarioRepo.findAll();
      res.json(usuarios);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /** Obtener usuario por ID */
  async getById(req: Request, res: Response) {
    try {
      const usuario = await usuarioRepo.findById(Number(req.params.id));
      if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

      res.json(usuario);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /** Crear usuario */
  async create(req: Request, res: Response) {
  try {
    const { nombre, apellido = "", email, password, rol } = req.body;

    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // ID se ignora porque lo genera SQLite
    const usuario = new Usuario(
      0,
      nombre,
      apellido,
      email,
      password,
      rol,
      false // conectado por defecto
    );

    const insertedId = await usuarioRepo.create(usuario);

    res.status(201).json({ message: "Usuario creado", id: insertedId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

  /** Actualizar usuario */
  async update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const existing = await usuarioRepo.findById(id);

    if (!existing) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const { nombre, apellido, email, password, rol, conectado } = req.body;

    const usuario = new Usuario(id, nombre, apellido, email, password, rol, conectado);
    await usuarioRepo.update(usuario);

    res.json({ message: "Usuario actualizado" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

  /** Eliminar usuario */
  async delete(req: Request, res: Response) {
  try {
    const eliminado = await usuarioRepo.delete(Number(req.params.id));

    if (!eliminado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
 }
}
