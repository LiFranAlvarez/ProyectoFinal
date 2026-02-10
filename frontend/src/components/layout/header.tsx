import { Link, useNavigate } from 'react-router-dom';
import { useBusqueda } from "../../context/busquedaContexto";
import "../../styles/header.css"
import { AuthContext } from '../../context/authContexto';
import { useContext, useState, useEffect } from 'react';
import { useCursos } from "../../context/cursosContexto";
import { Curso } from "../../types/cursoType";

const Header = () => {
  const { filtro, setFiltro } = useBusqueda();
  const { cursos } = useCursos(); 
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [textoLocal, setTextoLocal] = useState(filtro.texto || "");
  const [sugerencias, setSugerencias] = useState<Curso[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFiltro({ ...filtro, texto: textoLocal });

      if (textoLocal.trim()) {
        const coincidencias = cursos.filter(c =>
          c.titulo.toLowerCase().includes(textoLocal.toLowerCase())
        );
        setSugerencias(coincidencias.slice(0, 5));
      } else {
        setSugerencias([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [textoLocal, cursos]);

  const handleLogout = () => {
    setTextoLocal("");
    setFiltro({ ...filtro, texto: "" });
    auth?.logout();
    navigate('/');
  }

  return (
    <>
      <header className='header'>
        <div className="header-content">
          <Link to="/">
            <img src="/src/assets/icons/logo.png" alt="Logo" style={{ height: '50px', borderRadius: '100px' }} />
          </Link>
          
          <div className="busqueda-con-catalogo">
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={textoLocal}
              onChange={(e) => setTextoLocal(e.target.value)}
              className="search__input"
              autoComplete="on"
            />
            <Link to="/cursos" className="catalogo-link">Ver catálogo</Link>
          </div>
          {sugerencias.length > 0 && (
                  <ul className="sugerencias-lista">
                    {sugerencias.map(curso => (
                      <li key={curso._id}>
                        <Link to={`/cursos/${curso._id}`}>{curso.titulo}</Link>
                      </li>
                    ))}
                  </ul>
                )}
          <nav className="header-links">
            {!auth?.user ? (
              <>
                <Link to="/registro" className='register'>Registro</Link>
                <Link to="/auth/login" className='login'>Login</Link>
              </>
            ) : (
              <>
                <Link to="/perfil" className='login'>Perfil</Link>
                {auth?.user?.rol === "ADMIN" && (
                  <Link to="/admin" className='login'>Admin</Link>
                )}
                <button onClick={handleLogout} className='login'>Cerrar sesión</button>
              </>
            )}
          </nav>
        </div>
      </header>

      
    </>
  );
};

export default Header;
