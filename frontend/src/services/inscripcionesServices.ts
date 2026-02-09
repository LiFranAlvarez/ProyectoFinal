import { Inscripcion } from "../types/inscripcionType";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";


export const getCursosByUser = async (userId: string): Promise<Inscripcion[]> => {
  const res = await fetch(`${API_URL}/api/inscripcion/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error("Error al obtener cursos del usuario");
  return res.json();
};
export const inscribirCurso = async (cursoId: string, userId: string): Promise<void> => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    
    const res = await fetch(`${API_URL}/api/inscripcion/${cursoId}/${userId}`, { 
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
    });

    if (!res.ok) {
        let errorMessage = "Error desconocido al procesar la inscripción.";
        
        try {
            
            const errorData = await res.json(); 
            errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (error) {
            console.log(error)
            errorMessage = `El servidor devolvió un error ${res.status}.`;
        }
        
        throw new Error(errorMessage); 
    }
};

export const abandonarCurso = async (cursoId: string, userId: string) => {
  const res = await fetch(`${API_URL}/api/inscripcion/abandonar`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ cursoId, usuarioId: userId })
  });
  if (!res.ok) throw new Error("Error al abandonar curso");
  return res.json();
};

export const finalizarCursoProfesor = async (cursoId: string) => {
  const res = await fetch(`${API_URL}/api/cursos/finalizar-curso`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ idCurso: cursoId })
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al finalizar el curso");
  }
  return res.json();
};

export const getAllInscripciones = async (): Promise<Inscripcion[]> => {
  const res = await fetch(`${API_URL}/api/inscripcion`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error("Error al obtener todas las inscripciones");
  return res.json();
};

export default {getCursosByUser,inscribirCurso,abandonarCurso,finalizarCursoProfesor,getAllInscripciones};
