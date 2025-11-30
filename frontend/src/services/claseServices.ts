import { Clase } from "../types/claseType";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getClases = async (): Promise<Clase[]> => {
  const res = await fetch(`${API_URL}/api/clases`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error("Error al obtener clases");
  return res.json();
};

export const getClaseById = async (idClase: string | number): Promise<Clase> => {
  const res = await fetch(`${API_URL}/api/clases/${idClase}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error("Error al obtener clase");
  return res.json();
};

export const createClase = async (clase: Clase): Promise<Clase> => {
  const res = await fetch(`${API_URL}/api/clases`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(clase),
  });
  if (!res.ok) throw new Error("Error al crear clase");
  return res.json();
};

export const updateClase = async (idClase: string | number, clase: Clase): Promise<Clase> => {
  const res = await fetch(`${API_URL}/api/clases/${idClase}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(clase),
  });
  if (!res.ok) throw new Error("Error al actualizar clase");
  return res.json();
};

export const deleteClase = async (idClase: string | number): Promise<void> => {
  const res = await fetch(`${API_URL}/api/clases/${idClase}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error("Error al eliminar clase");
};