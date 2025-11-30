import { Link } from 'react-router-dom';
import { Curso } from "../../types/cursoType";
import "../../styles/cursoCards.css"


const CursoCard = ({ curso }: { curso: Curso }) => (
  <div className='curso'>
    <h3>{curso.titulo}</h3>
    <p><strong>Descripción:</strong>{curso.descripcion ?? "Sin descripción"}</p>
    <p><strong>Categoría:</strong> {curso.categorias?.join(", ") ?? "Sin categoría"}</p>
    <Link to={`/cursos/${curso._id}`} className='curso-button'>
      <button>Ver más</button>
    </Link>
  </div>
);




export default CursoCard;