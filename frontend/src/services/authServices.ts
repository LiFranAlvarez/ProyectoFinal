
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const login = async (data: { email: string; password: string }) => {
  const res = await fetch(`${API_URL}/api/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error en login");
  return res.json();
};

export const register = async (data: { nombre: string; email: string; password: string; rol:string }) => {
  const res = await fetch(`${API_URL}/api/usuario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error en registro");
  return res.json();
};