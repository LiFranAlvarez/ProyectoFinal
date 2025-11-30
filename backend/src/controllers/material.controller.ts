import { Request, Response } from 'express';
import * as materialService from "../services/material.service";

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
    const material = await materialService.createMaterial(req.body);
    res.status(201).json(material);
  } catch (error) {
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
    const material = await materialService.deleteMaterial(id);
    if (!material) return res.status(404).json({ error: "Material no encontrado" });
    res.json({ message: "Material eliminado" });
  } catch (error) {
    res.status(400).json({ error: "Error al eliminar material" });
  }
};