import { Request, Response } from 'express';
import * as materialService from "../services/material.service";
import Curso from "../models/curso.schema";

export const getMateriales = async (req:Request, res:Response) => {
  try {
    const materiales = await materialService.getMateriales();
    res.json(materiales);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener materiales" });
  }
};

export const getMaterialById = async (req:Request, res:Response) => {
  try {
    const { id } = req.params;
    const material = await materialService.getMaterialById(id);
    if (!material) return res.status(404).json({ error: "Material no encontrado" });
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener material" });
  }
};

export const createMaterial = async (req:Request, res:Response) => {
  try {
    const { titulo, tipo, enlace, cursoId } = req.body;

    if (!titulo || !cursoId) {
      return res.status(400).json({ error: "Título y cursoId son requeridos" });
    }

    const material = await materialService.createMaterial({
      titulo,
      tipo,
      enlace
    });

    if (material && !Array.isArray(material)) {
      await Curso.findByIdAndUpdate(
        cursoId,
        { $push: { materiales: material._id } },
        { new: true }
      );
    }

    res.status(201).json(material);
  } catch (error) {
    console.error('ERROR AL CREAR MATERIAL:', error);
    res.status(400).json({ error: "Error al crear material" });
  }
};

export const updateMaterial = async (req:Request, res:Response)=> {
  try {
    const { id } = req.params;
    const material = await materialService.updateMaterial(id, req.body);
    if (!material) return res.status(404).json({ error: "Material no encontrado" });
    res.json(material);
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar material" });
  }
};

export const deleteMaterial = async (req:Request, res:Response) => {
  try {
    const { id } = req.params;
    const { cursoId } = req.body;

    const material = await materialService.deleteMaterial(id);
    if (!material) return res.status(404).json({ error: "Material no encontrado" });

    if (cursoId) {
      await Curso.findByIdAndUpdate(
        cursoId,
        { $pull: { materiales: id } },
        { new: true }
      );
    }

    res.json({ message: "Material eliminado" });
  } catch (error) {
    res.status(400).json({ error: "Error al eliminar material" });
  }
};