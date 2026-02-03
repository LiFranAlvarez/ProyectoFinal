import Material from '../models/material.schema';
import { UpdateMaterialDTO, CreateMaterialDTO } from '../dtos/materialDTO';

export const getMateriales = async () => {
  return await Material.find();
};

export const getMaterialById = async (id: string) => {
  return await Material.findById(id);
};

export const createMaterial = async (data: CreateMaterialDTO) => {
  if (Array.isArray(data)) {
    return await Material.insertMany(data);
  }

  const material = new Material(data);
  return await material.save();
};

export const updateMaterial = async (id: string, data: UpdateMaterialDTO) => {
  return await Material.findByIdAndUpdate(id, data, { new: true });
};

export const deleteMaterial = async (id: string) => {
  return await Material.findByIdAndDelete(id);
};
