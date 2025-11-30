import Clase from "../models/clase.schema";

export const getClases = async () => {
  return await Clase.find();
};

export const getClaseById = async (id: string) => {
  return await Clase.findById(id);
};

export const createClase = async (data: any | any[]) => {
    if (Array.isArray(data)) {
        return await Clase.insertMany(data);
    }
    const clase = new Clase(data);
    return await clase.save();
};

export const updateClase = async (id: string, data: any) => {
  return await Clase.findByIdAndUpdate(id, data, { new: true });
};

export const deleteClase = async (id: string) => {
  return await Clase.findByIdAndDelete(id);
};