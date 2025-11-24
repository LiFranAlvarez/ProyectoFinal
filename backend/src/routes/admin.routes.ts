import express from "express";
import { Administrador } from "../models/administrador";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateRole } from "../middlewares/validateRole.js";
import { apiKeyMiddleware } from "../middlewares/apiKeyMiddleware.js";

const router = express.Router();
let administradores: Administrador[] = [];


router.get("/privado", authMiddleware, (req, res) => {
  res.json({ mensaje: "Ruta privada accesible" });
});

router.get("/", (req, res) => {
  res.json(administradores);
});

router.get("/reportes", apiKeyMiddleware, (req, res) => {
  res.json({ mensaje: "Acceso autorizado al reporte." });
});

router.post("/", (req, res) => {
  const { id, nombre, apellido, email, password } = req.body;
  const nuevo = new Administrador(id, nombre, apellido, email, password);
  administradores.push(nuevo);
  res.status(201).json({ mensaje: "Administrador creado correctamente", admin: nuevo });
});

router.delete("/:id", validateRole(["administrador"]), (req, res) => {
  // Solo un administrador puede eliminar usuarios
  res.json({ mensaje: "Usuario eliminado" });
});

export default router;
