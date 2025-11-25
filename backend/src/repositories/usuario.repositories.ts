import { Database } from "sqlite3";
import { Usuario } from "../models/usuario";
import db from "../config/database";
import bcrypt from "bcryptjs";

interface RowUsuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: string;
  conectado: number;
}

export class UsuarioRepository {
  private db: Database;

  constructor() {
    this.db = db;
  }

  /** Obtener todos los usuarios */
  findAll(): Promise<Usuario[]> {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM usuarios", [], (err, rows: RowUsuario[]) => {
        if (err) return reject(err);

        const usuarios = rows.map(
          row =>
            new Usuario(
              row.id,
              row.nombre,
              row.apellido,
              row.email,
              row.password,
              row.rol,
              !!row.conectado
            )
        );

        resolve(usuarios);
      });
    });
  }

  /** Buscar por ID */
  findById(id: number): Promise<Usuario | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT * FROM usuarios WHERE id = ?",
        [id],
        (err, row: RowUsuario | undefined) => {
          if (err) return reject(err);

          if (!row) return resolve(null);

          resolve(
            new Usuario(
              row.id,
              row.nombre,
              row.apellido,
              row.email,
              row.password,
              row.rol,
              !!row.conectado
            )
          );
        }
      );
    });
  }

  /** Buscar por email */
  findByEmail(email: string): Promise<Usuario | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
        (err, row: RowUsuario | undefined) => {
          if (err) return reject(err);

          if (!row) return resolve(null);

          resolve(
            new Usuario(
              row.id,
              row.nombre,
              row.apellido,
              row.email,
              row.password,
              row.rol,
              !!row.conectado
            )
          );
        }
      );
    });
  }

  /** Crear usuario con password hasheado */
  async create(usuario: Usuario): Promise<number> {
    const hashedPassword = await bcrypt.hash(usuario.getPassword(), 10);

    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO usuarios (nombre, apellido, email, password, rol)
         VALUES (?, ?, ?, ?, ?)`,
        [
          usuario.getNombre(),
          usuario.getApellido(),
          usuario.getEmail(),
          hashedPassword,
          usuario.getRol(),
        ],
        function (err) {
          if (err) return reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

  /** Actualizar usuario */
  async update(usuario: Usuario): Promise<void> {
    const hashedPassword = await bcrypt.hash(usuario.getPassword(), 10);

    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE usuarios 
         SET nombre = ?, apellido = ?, email = ?, password = ?, rol = ? 
         WHERE id = ?`,
        [
          usuario.getNombre(),
          usuario.getApellido(),
          usuario.getEmail(),
          hashedPassword,
          usuario.getRol(),
          usuario.getId(),
        ],
        err => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }

  /** Eliminar usuario */
  delete(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run(
        "DELETE FROM usuarios WHERE id = ?",
        [id],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes > 0);
        }
      );
    });
  }
}
