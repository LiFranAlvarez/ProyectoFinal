import MaterialForm from '../components/forms/materialForms';
import { useNavigate, useParams } from 'react-router-dom';
import { Material } from '../types/materialType';

const NuevoMaterial = () => {
    const navigate = useNavigate();
    const { idCurso } = useParams<{ idCurso: string }>();
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    const handleCrear = async (material: Omit<Material, "_id" | "fechaSubida">) => {
        try {
            if (!idCurso) {
                throw new Error('ID del curso no disponible');
            }

            const payload = {
                titulo: material.titulo,
                tipo: material.tipo,
                enlace: material.enlace,
                cursoId: idCurso,
            };

            const res = await fetch('/api/materiales', {
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

            alert('Material creado con éxito');
            navigate(`/cursos/${idCurso}`);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error al crear material:', error.message || error);
            alert('No se pudo crear el material: ' + (error.message || error));
        }
    };

    return <MaterialForm onSubmit={handleCrear} />;
};

export default NuevoMaterial;
