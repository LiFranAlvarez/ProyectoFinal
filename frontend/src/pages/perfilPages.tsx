import { useState, useEffect, useContext } from "react";
import { Usuario } from "../types/usuarioType";
import { getUsuarioById, updateUsuario } from "../services/usuarioServices";
import { getCursosByUser } from "../services/inscripcionesServices";
import { AuthContext } from "../context/authContexto";
import CursoCard from "../components/catalogo/cursoCard";
import "../styles/perfilUsuario.css";
import "../styles/botonSimple.css";

const PerfilUsuario = () => {
  const [usuario, setUsuario] = useState<Usuario>({
    _id: "",
    nombre: "",
    email: "",
    rol: "ALUMNO",
    foto: "" // nuevo campo para foto de perfil
  });

  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState<string>(""); // feedback visual
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
          foto: data.foto ?? ""
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
        setMensaje("Error al cargar el perfil");
      }
    };

    fetchUsuario();
  }, [auth?.user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!usuario) return;
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    try {
      // Validaciones simples
      if (!usuario.nombre.trim()) {
        setMensaje("El nombre no puede estar vacío");
        return;
      }
      if (!usuario.email.includes("@")) {
        setMensaje("Email inválido");
        return;
      }

      const updated = await updateUsuario(usuario._id, {
        nombre: usuario.nombre,
        email: usuario.email,
        foto: usuario.foto
      });

      setUsuario(updated);
      auth?.setUser(updated);
      setEditando(false);
      setMensaje("Perfil actualizado correctamente ✅");
    } catch (err) {
      console.error(err);
      setMensaje("Error al guardar los cambios ❌");
    }
  };

  if (!usuario) return <p>Cargando perfil...</p>;

  return (
    <main className="perfil">
      <h1>Perfil de Usuario</h1>

      {mensaje && <div className="mensaje-feedback">{mensaje}</div>}

      <div className="perfil-card">
        <h2>Información personal:</h2>

        {/* Foto de perfil */}
        <div className="foto-perfil">
          {usuario.foto ? (
            <img src={usuario.foto} alt="Foto de perfil" />
          ) : (
            <span>Sin foto</span>
          )}
          {editando && (
            <input
              type="text"
              name="foto"
              value={usuario.foto ?? ""}
              onChange={handleChange}
              placeholder="URL de la foto"
            />
          )}
        </div>

        <label>
          Nombre:
          {editando ? (
            <input
              type="text"
              name="nombre"
              value={usuario?.nombre ?? ""}
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
                <CursoCard curso={c} />
                <span className={`estado estado-${c.estado.toLowerCase()}`}>{c.estado}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {editando ? (
        <button onClick={handleGuardar} className="btn-edit">Guardar</button>
      ) : (
        <button onClick={() => setEditando(true)} className="btn-edit">✏️ Editar</button>
      )}
    </main>
  );
};

export default PerfilUsuario;
