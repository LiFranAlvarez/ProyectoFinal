import Material from "../models/material.schema";

export const getMateriales = async () => {
  return await Material.find();
};

export const getMaterialById = async (id: string) => {
  return await Material.findById(id);
};

export const createMaterial = async (data: any | any[]) => {
    if (Array.isArray(data)) {
        return await Material.insertMany(data);
    }
    
    const material = new Material(data);
    return await material.save();
};

export const updateMaterial = async (id: string, data: any) => {
  return await Material.findByIdAndUpdate(id, data, { new: true });
};

export const deleteMaterial = async (id: string) => {
  return await Material.findByIdAndDelete(id);
};
