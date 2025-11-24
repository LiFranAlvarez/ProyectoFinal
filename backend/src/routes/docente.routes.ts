import express from "express";
import { Docente } from "../models/docente";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
let docentes: Docente[] = [];

router.get("/privado", authMiddleware, (req, res) => {
  res.json({ mensaje: "Ruta privada accesible" });
});

router.get("/", (req, res) => {
  res.json(docentes);
});

router.post("/", (req, res) => {
  const { id, nombre, apellido, email, password, especialidad } = req.body;
  const nuevo = new Docente(id, nombre, apellido, email, password, especialidad);
  docentes.push(nuevo);
  res.status(201).json({ mensaje: "Docente creado correctamente", docente: nuevo });
});

export default router;
