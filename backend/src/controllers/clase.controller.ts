import * as claseService from "../services/clase.service";
import { Request,Response } from "express";
export const getClases = async (req:Request, res:Response) => {
  try {
    const clases = await claseService.getClases();
    res.json(clases);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener clases" });
  }
};

export const getClaseById = async (req:Request, res:Response) => {
  try {
    const { id } = req.params;
    const clase = await claseService.getClaseById(id);
    if (!clase) return res.status(404).json({ error: "Clase no encontrada" });
    res.json(clase);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener clase" });
  }
};

export const createClase = async (req:Request, res:Response) => {
  try {
    const clase = await claseService.createClase(req.body);
    res.status(201).json(clase);
  } catch (error) {
    console.error('ERROR DETALLADO DE VALIDACIÓN/MOLDEO:', error);
    res.status(400).json({ error: "Error al crear clase" });
  }
};

export const updateClase = async (req:Request, res:Response) => {
  try {
    const { id } = req.params;
    const clase = await claseService.updateClase(id, req.body);
    if (!clase) return res.status(404).json({ error: "Clase no encontrada" });
    res.json(clase);
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar clase" });
  }
};

export const deleteClase = async (req:Request, res:Response) => {
  try {
    const { id } = req.params;
    const clase = await claseService.deleteClase(id);
    if (!clase) return res.status(404).json({ error: "Clase no encontrada" });
    res.json({ message: "Clase eliminada" });
  } catch (error) {
    res.status(400).json({ error: "Error al eliminar clase" });
  }
};