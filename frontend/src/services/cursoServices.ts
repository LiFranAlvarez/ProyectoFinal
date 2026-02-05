import { Curso } from "../types/cursoType";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const getHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("token")}`,
});

export const getCursoById = async (idCurso: string | number): Promise<Partial<Curso>> => {
  
  const res = await fetch(`${API_URL}/cursos/${idCurso}`,{
    method: "GET",
    cache: "no-store", 
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error("Error al obtener curso");
  return res.json();
};

export const createCurso = async (curso: Partial<Curso>): Promise<Curso> => {
  const res = await fetch(`${API_URL}/cursos`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(curso),
  });
  if (!res.ok) throw new Error("Error al crear curso");
  return res.json();
};

export const updateCurso = async (idCurso: string | number, curso: Curso): Promise<Partial<Curso>> => {
  const res = await fetch(`${API_URL}/cursos/${idCurso}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(curso),
  });
  if (!res.ok) throw new Error("Error al actualizar curso");
  return res.json();
};

export const deleteCurso = async (idCurso: string | number): Promise<void> => {
  const res = await fetch(`${API_URL}/cursos/${idCurso}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error("Error al eliminar curso");
};

export const getCursosByProfesor = async (idCursoProfesor: string): Promise<Curso[]> => {
  const res = await fetch(`${API_URL}/cursos/profesor/${idCursoProfesor}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error("Error al obtener cursos del profesor");
  return res.json();
};