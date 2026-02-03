import Clase from "../models/clase.schema";
import { ClaseDTO } from "../dtos/claseDTO";

export const getClases = async () => {
  return await Clase.find();
};

export const getClaseById = async (id: string) => {
  return await Clase.findById(id);
};

export const createClase = async (data: ClaseDTO | ClaseDTO[]) => {
    if (Array.isArray(data)) {
        return await Clase.insertMany(data);
    }
    const clase = new Clase(data);
    return await clase.save();
};

export const updateClase = async (id: string, data: ClaseDTO) => {
  return await Clase.findByIdAndUpdate(id, data, { new: true });
};

export const deleteClase = async (id: string) => {
  return await Clase.findByIdAndDelete(id);
};