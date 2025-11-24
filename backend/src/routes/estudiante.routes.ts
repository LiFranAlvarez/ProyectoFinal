import express from "express";
import { Estudiante } from "../models/estudiante";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
let estudiantes: Estudiante[] = [];

router.get("/privado", authMiddleware, (req, res) => {
  res.json({ mensaje: "Ruta privada accesible" });
});

router.get("/", (req, res) => {
  res.json(estudiantes);
});

router.post("/", (req, res) => {
  const { id, nombre, apellido, email, password, legajo } = req.body;
  const nuevo = new Estudiante(id, nombre, apellido, email, password, legajo);
  estudiantes.push(nuevo);
  res.status(201).json({ mensaje: "Estudiante creado correctamente", estudiante: nuevo });
});

export default router;
