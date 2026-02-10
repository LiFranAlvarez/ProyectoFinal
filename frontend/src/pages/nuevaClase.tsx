import ClaseForm from '../components/forms/claseForms';
import { useNavigate, useParams } from 'react-router-dom';
import { Clase } from '../types/claseType';

const NuevaClase = () => {
    const navigate = useNavigate();
    const { idCurso } = useParams<{ idCurso: string }>();
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    const handleCrear = async (clase: Omit<Clase, "fecha">) => {
        try {
            if (!idCurso) {
                throw new Error('ID del curso no disponible');
            }

            const payload = {
                titulo: clase.titulo,
                estado: clase.estado,
                linkGrabacion: clase.linkGrabacion,
                cursoId: idCurso,
            };

            const res = await fetch('/api/clases', {
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

            alert('Clase creada con éxito');
            navigate(`/cursos/${idCurso}`);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error al crear clase:', error.message || error);
            alert('No se pudo crear la clase: ' + (error.message || error));
        }
    };

    return <ClaseForm onSubmit={handleCrear} />;
};

export default NuevaClase;
