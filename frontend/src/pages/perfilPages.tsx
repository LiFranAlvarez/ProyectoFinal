/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useContext } from "react";
import { Usuario } from "../types/usuarioType";
import { getUsuarioById, updateUsuario } from "../services/usuarioServices";
import { getCursosByUser } from "../services/inscripcionesServices";
import { AuthContext } from "../context/authContexto";
import CursoCard from "../components/catalogo/cursoCard";
import "../styles/perfilUsuario.css";
import "../styles/botonSimple.css"

const PerfilUsuario = () => {
  const [usuario, setUsuario] = useState<Usuario>({
  _id: "",
  nombre: "",
  email: "",
  rol: "ALUMNO",
});

  const [editando, setEditando] = useState(false);
  const [cursosTotales, setCursosTotales] = useState<number>(0);
  const [cursosCompletados, setCursosCompletados] = useState<number>(0);
  const [cursosEnCurso, setCursosEnCurso] = useState<number>(0);
  const [cursos, setCursos] = useState<any[]>([]);
  const auth = useContext(AuthContext);
  

  useEffect(() => {
    const fetchUsuario = async () => {
    try {
      let userId = auth?.user?._id;
      if (!userId) userId = localStorage.getItem("userId") || "";
      if (!userId) return;

      const data = await getUsuarioById(userId);
      setUsuario({
        ...data,
        nombre: data.nombre ?? "",
        email: data.email ?? "",
      });
      const inscripciones = await getCursosByUser(userId);
      const cursosUsuario = inscripciones.map((i: any) => ({
        ...(typeof i.cursoId === "object" ? i.cursoId : {}),  
        estado: i.estadoInscripcion,                          
        _idInscripcion: i._id,
      }));

      setCursos(cursosUsuario);

      setCursosTotales(cursosUsuario.length);
      setCursosCompletados(
        cursosUsuario.filter(c => c.estado === "TERMINADA" || c.estado === "COMPLETADO").length
      );

      setCursosEnCurso(
        cursosUsuario.filter(c => c.estado === "EN_PROCESO" || c.estado === "EN_CURSO").length
      );

    } catch (err) {
      console.error(err);
    }
  };

    fetchUsuario();
  }, [auth?.user]);
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!usuario) return;
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    try {
      const updated = await updateUsuario(usuario._id, { nombre: usuario.nombre, email: usuario.email });
      
      setUsuario(updated);
      
      auth?.setUser(updated); 

      setEditando(false);
    } catch (err) {
      console.error(err);
    }
  };
  if (!usuario) return <p>Cargando perfil...</p>;
 
  return (
    <main className="perfil">
      <h1>Perfil de Usuario</h1>
      <div className="perfil-card">
        <h2>Informacion personal:</h2>
        <label>
          Nombre:
          {editando ? (
            <input
              type="text"
              name="nombre"
              value={usuario?.nombre?? ""}
              onChange={handleChange}
            />
          ) : (
            <span>{usuario.nombre}</span>
          )}
        </label>

        <label>
          Email:
          {editando ? (
            <input
              type="email"
              name="email"
              value={usuario?.email ?? ""}
              onChange={handleChange}
            />
          ) : (
            <span>{usuario.email}</span>
          )}
        </label>

        <label>
          Rol:
          <span>{usuario.rol}</span>
        </label>

        
      </div>
      <section className="perfil-estadisticas">
        <h2>Estadísticas</h2>
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-label">Cursos Totales:</span>
            <span className="stat-value">{cursosTotales}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">En Curso:</span>
            <span className="stat-value">{cursosEnCurso}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completados:</span>
            <span className="stat-value">{cursosCompletados}</span>
          </div>
        </div>
      </section>

      <section className="perfil-cursos">
        <h2>Mis cursos</h2>

        {cursosTotales === 0 ? (
          <p>No estás inscripto en ningún curso.</p>
        ) : (
          <div className="curso-curso-grid">
            {cursos.map(c => (
            <div className="curso-card" key={c._id}>
              <CursoCard key={c._id} curso={c} />
              <span className="estado">{c.estado}</span>
            </div>
            ))}
          </div>
        )}
      </section>

      {editando ? (
          <button onClick={handleGuardar} className="btn-edit">Guardar</button>
        ) : (
          <button onClick={() => setEditando(true)}>✏️ Editar</button>
        )}
    </main>
  );
};

export default PerfilUsuario;
