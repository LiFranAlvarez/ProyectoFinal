import express from "express";
import { Curso } from "../models/curso";
import { Docente } from "../models/docente";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

let cursos: Curso[] = [];


router.get("/privado", authMiddleware, (req, res) => {
  res.json({ mensaje: "Ruta privada accesible" });
});

router.get("/", (req, res) => {
  res.json(cursos);
});

router.post("/", (req, res) => {
  const { id, codigo, titulo, descripcion, categoria, docente } = req.body;
  const nuevoCurso = new Curso(
    id,
    codigo,
    titulo,
    descripcion,
    categoria,
    new Date(),
    new Docente(docente.id, docente.nombre, docente.apellido, docente.email, docente.password, docente.especialidad)
  );
  cursos.push(nuevoCurso);
  res.status(201).json({ mensaje: "Curso creado correctamente", curso: nuevoCurso });
});

router.put("/:id", (req, res) => {
  const curso = cursos.find(c => c.getId() === Number(req.params.id));
  if (!curso) return res.status(404).json({ mensaje: "Curso no encontrado" });

  curso.setTitulo(req.body.titulo || curso.getTitulo());
  res.json({ mensaje: "Curso actualizado", curso });
});

router.delete("/:id", (req, res) => {
  cursos = cursos.filter(c => c.getId() !== Number(req.params.id));
  res.json({ mensaje: "Curso eliminado correctamente" });
});

export default router;
