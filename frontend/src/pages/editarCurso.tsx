import CursoForm from '../components/forms/cursoForms';
import { useNavigate, useParams } from 'react-router-dom';
import { Curso } from '../types/cursoType';
import { useEffect, useState } from 'react';
import { getCursoById } from '../services/cursoServices';

const EditarCurso = () => {
    const navigate = useNavigate();
    const { idCurso } = useParams<{ idCurso: string }>();
    const [curso, setCurso] = useState<Curso | null>(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    useEffect(() => {
        if (!idCurso) return;

        getCursoById(idCurso)
            .then(data => setCurso(data as Curso))
            .catch(error => {
                console.error("Error al cargar el curso:", error);
                alert('No se pudo cargar el curso');
                navigate(-1);
            })
            .finally(() => setLoading(false));
    }, [idCurso, navigate]);

    const handleActualizar = async (cursoActualizado: Curso) => {
        try {
            const payload = {
                titulo: cursoActualizado.titulo,
                descripcion: cursoActualizado.descripcion,
                categorias: cursoActualizado.categorias,
                estado: cursoActualizado.estado || 'EN CURSO',
            };

            const res = await fetch(`/api/cursos/${idCurso}`, {
                method: 'PUT',
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

            alert('Curso actualizado con éxito');
            navigate(`/api/cursos/${idCurso}`);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error al actualizar curso:', error.message || error);
            alert('No se pudo actualizar el curso: ' + (error.message || error));
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!curso) {
        return <div>⚠️ No se pudo cargar el curso.</div>;
    }

    return <CursoForm cursoInicial={curso} onSubmit={handleActualizar} />;
};

export default EditarCurso;
