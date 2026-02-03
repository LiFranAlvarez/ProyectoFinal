import { Usuario } from "../types/usuarioType";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getAuthHeaders = (contentType = false) => {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  if (contentType) headers["Content-Type"] = "application/json";
  return headers;
};

export const getUsuarios = async (): Promise<Usuario[]> => {
  const res = await fetch(`${API_URL}/api/usuarios`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
};

export const getUsuarioById = async (id: string | number): Promise<Usuario> => {
  const res = await fetch(`${API_URL}/api/usuario/${id}`, {
    headers: getAuthHeaders(), 
  });
  if (!res.ok) throw new Error("Error al obtener usuario");
  return res.json();
};

export const updateUsuario = async (id: string, payload: Partial<Usuario>) => {
  const response = await fetch(`${API_URL}/api/usuario/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("No se pudo actualizar el usuario");
  return response.json();
};

export const deleteUsuario = async (id: string | number): Promise<void> => {
  const res = await fetch(`${API_URL}/api/usuario/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al eliminar usuario");
};
