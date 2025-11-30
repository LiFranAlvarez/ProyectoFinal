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

            const res = await fetch('/api/cursos', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                const errorMessage = err.message || `Error ${res.status}: Fallo en el servidor.`; 
                throw new Error(errorMessage);
            }

            
            alert('Curso creado con éxito'); 
            navigate('/dashboard/maestro');
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error al crear curso:', error.message || error);
            alert('No se pudo crear el curso: ' + (error.message || error));
        }
    };

    return <CursoForm onSubmit={handleCrear} />;
};

export default CrearCurso;