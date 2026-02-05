import CursoForm from '../components/forms/cursoForms';
import { useNavigate } from 'react-router-dom';
import { Curso } from '../types/cursoType';

const CrearCurso = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    const handleCrear = async (curso: Curso) => {
        try {
            const profesorId = localStorage.getItem('profesorId') || 'ID_DE_FALLBACK';

            const payload = {
                titulo: curso.titulo,
                descripcion: curso.descripcion,
                categorias: curso.categorias, 
                profesor: profesorId, 
                estado: 'EN CURSO', 
            };

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            const res = await fetch(`${API_URL}/cursos`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({ message: 'Error desconocido' })) as { message: string };
                throw new Error(err.message || `Error ${res.status}: Fallo en el servidor.`);
            }

            
            alert('Curso creado con éxito'); 
            navigate('/dashboard/maestro');
        
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error inesperado';
            
            console.error('Error al crear curso:', errorMessage);
            alert('No se pudo crear el curso: ' + errorMessage);
        }
    };

    return <CursoForm onSubmit={handleCrear} />;
};

export default CrearCurso;