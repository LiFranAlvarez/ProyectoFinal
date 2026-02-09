import { Material } from "../types/materialType";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_KEY = import.meta.env.VITE_API_KEY;

export const getMateriales = async (): Promise<Material[]> => {
  const res = await fetch(`${API_URL}/api/materiales`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "x-api-key": API_KEY
    },
  });
  if (!res.ok) throw new Error("Error al obtener materiales");
  return res.json();
};

export const getMaterialById = async (idMaterial: string | number): Promise<Material> => {
  const res = await fetch(`${API_URL}/api/materiales/${idMaterial}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "x-api-key": API_KEY
    },
  });
  if (!res.ok) throw new Error("Error al obtener material");
  return res.json();
};

export const createMaterial = async (material: Material): Promise<Material> => {
  const res = await fetch(`${API_URL}/api/materiales`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "x-api-key": API_KEY
    },
    body: JSON.stringify(material),
  });
  if (!res.ok) throw new Error("Error al crear material");
  return res.json();
};

export const updateMaterial = async (idMaterial: string | number, material: Material): Promise<Material> => {
  const res = await fetch(`${API_URL}/api/materiales/${idMaterial}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "x-api-key": API_KEY
    },
    body: JSON.stringify(material),
  });
  if (!res.ok) throw new Error("Error al actualizar material");
  return res.json();
};

export const deleteMaterial = async (idMaterial: string | number, cursoId?: string): Promise<void> => {
  const res = await fetch(`${API_URL}/api/materiales/${idMaterial}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "x-api-key": API_KEY
    },
    body: JSON.stringify({ cursoId }),
  });
  if (!res.ok) throw new Error("Error al eliminar material");
};