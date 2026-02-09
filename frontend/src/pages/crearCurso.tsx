import CursoForm from '../components/forms/cursoForms';
import { useNavigate } from 'react-router-dom';
import { Curso } from '../types/cursoType';
import { createCurso } from '../services/cursoServices'; 
const CrearCurso = () => {
  const navigate = useNavigate();

 const handleCrear = async (curso: Curso) => {
  try {
    const payload = {
      ...curso,
      profesor: typeof curso.profesor === "string" 
        ? curso.profesor 
        : curso.profesor?._id, 
      estado: "EN CURSO" as const,
    };
    console.log("Payload para crear curso:", payload);
    await createCurso(payload);
    

    alert("Curso creado con éxito");
    navigate("/admin");
  } catch (error: any) {
    console.error("Error al crear curso:", error.message || error);
    alert("No se pudo crear el curso: " + (error.message || error));
  }
};

  return <CursoForm onSubmit={handleCrear} />;
};

export default CrearCurso;