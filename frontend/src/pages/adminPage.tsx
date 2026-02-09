import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminTable from "../components/adminTablas";
import AdminCharts from "../components/adminCharts";
import { deleteCurso, getCursos } from "../services/cursoServices";
import { deleteUsuario, getUsuarios, updateUsuario } from "../services/usuarioServices";
import { getAllInscripciones } from "../services/inscripcionesServices";
import { Curso } from "../types/cursoType";
import { Usuario } from "../types/usuarioType";
import { Inscripcion } from "../types/inscripcionType";
import "../styles/adminPage.css";

const AdminPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("reportes");
  const [data, setData] = useState<{
    cursos: Curso[],
    usuarios: Usuario[],
    inscripciones: Inscripcion[]
  }>({ cursos: [], usuarios: [], inscripciones: [] });
  
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [c, u, i] = await Promise.all([
          getCursos(),
          getUsuarios(),
          getAllInscripciones()
        ]);
        setData({ cursos: c, usuarios: u, inscripciones: i });
      } catch (error) {
        console.error("Error en carga de datos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- HANDLERS ---

  const deleteCursoHandler = async (_id: string) => {
    if (window.confirm("¿Confirma que desea eliminar este curso?")) {
      try { 
        await deleteCurso(_id);
        setData(prev => ({
          ...prev,
          cursos: prev.cursos.filter(c => c._id !== _id)
        }));
        alert("Curso eliminado exitosamente");
      } catch (err) {
        alert("Error al eliminar el curso");
      }
    }
  };

  const deleteUsuarioHandler = async (_id: string | undefined) => {
    if (!_id) return;
    if (window.confirm("¿Confirma que desea eliminar este usuario?")) {
      try {
        await deleteUsuario(_id);
        setData(prev => ({
          ...prev,
          usuarios: prev.usuarios.filter(u => u._id !== _id)
        }));
        alert("Usuario eliminado exitosamente");
      } catch (err) { 
        alert("Error al eliminar el usuario");
      }
    }
  };

  const handleCambiarRol = async (usuario: Usuario) => {
    if (!usuario._id) return;
    
    const nuevoRol = window.prompt(
      `Cambiar rol para ${usuario.nombre}. (PROFESOR, ALUMNO)`,
      usuario.rol
    );

    if (nuevoRol) {
      const rolFinal = nuevoRol.toUpperCase();

      if (rolFinal === "ALUMNO" || rolFinal === "PROFESOR" || rolFinal === "ADMIN") {
        try {
          // Llamada al servicio con tu backend corregido (solo envía el rol)
          await updateUsuario(usuario._id, { rol: rolFinal });
          
          setData(prev => ({
            ...prev,
            usuarios: prev.usuarios.map(u => 
              // Usamos 'as Usuario' para que TS acepte la actualización del estado
              u._id === usuario._id ? ({ ...u, rol: rolFinal } as Usuario) : u
            )
          }));
          
          alert("Rol actualizado con éxito");
        } catch (error) {
          alert("Error al actualizar el rol");
        }
      } else {
        alert("Rol no válido. Usa: PROFESOR o ALUMNO");
      }
    }
  };

  const filteredData = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return {
      cursos: data.cursos.filter(c => c.titulo.toLowerCase().includes(search)),
      alumnos: data.usuarios.filter(u => u.rol === "ALUMNO" && u.nombre.toLowerCase().includes(search)),
      profesores: data.usuarios.filter(u => u.rol === "PROFESOR" && u.nombre.toLowerCase().includes(search))
    };
  }, [data, searchTerm]);

  // --- COLUMNAS ---

  const cursoColumns = [
    { header: "Título", render: (c: Curso) => <strong>{c.titulo}</strong> },
    { 
      header: "Profesor", 
      render: (c: Curso) => 
        typeof c.profesor === "object" && c.profesor !== null
          ? (c.profesor as any).nombre || "Sin asignar"
          : (typeof c.profesor === "string" ? c.profesor : "Sin asignar")
    },
    { header: "Estado", render: (c: Curso) => <span className={`badge ${c.estado}`}>{c.estado}</span> }
  ];

  const usuarioColumns = [
    { header: "Nombre", render: (u: Usuario) => u.nombre },
    { header: "Email", render: (u: Usuario) => u.email },
    { 
      header: "Rol", 
      render: (u: Usuario) => (
        <span className={`tag-rol ${u.rol?.toLowerCase()}`}>
          {u.rol}
        </span>
      ) 
    }
  ];

  return (
    <main className="admin-page">
      <header className="admin-header">
        <h1>Panel de Administración</h1>
        <div className="search-container">
          <input 
            type="text" 
            placeholder={`Buscar en ${activeTab}...`} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <nav className="admin-nav">
        {["reportes", "analisis", "cursos", "alumnos", "profesores"].map(tab => (
          <button 
            key={tab} 
            className={activeTab === tab ? "active" : ""} 
            onClick={() => { setActiveTab(tab); setSearchTerm(""); }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      <section className="admin-content">
        {loading ? (
          <div className="loader">Cargando datos del sistema...</div>
        ) : (
          <>
            {activeTab === "reportes" && (
              <div className="stats-grid">
                <div className="stat-card"><h3>{data.cursos.length}</h3><p>Cursos</p></div>
                <div className="stat-card"><h3>{filteredData.alumnos.length}</h3><p>Alumnos</p></div>
                <div className="stat-card"><h3>{filteredData.profesores.length}</h3><p>Profesores</p></div>
                <div className="stat-card"><h3>{data.inscripciones.length}</h3><p>Inscripciones</p></div>
              </div>
            )}
            
            {activeTab === "analisis" && (
              <div className="analisis-view">
                <h2>Análisis de Plataforma</h2>
                <AdminCharts cursos={data.cursos} inscripciones={data.inscripciones} />
              </div>
            )}

            {activeTab === "cursos" && (
              <div>
                <button onClick={() => navigate('/admin/cursos/crear')} className="btn-crear">
                  ➕ Crear Curso Nuevo
                </button>
                <AdminTable 
                  data={filteredData.cursos} 
                  columns={cursoColumns} 
                  onEdit={(curso) => navigate(`/admin/cursos/editar/${curso._id}`)}
                  onDelete={(curso)=> deleteCursoHandler(curso._id!)} 
                />
              </div>
            )}

            {activeTab === "alumnos" && (
              <AdminTable 
                data={filteredData.alumnos} 
                columns={usuarioColumns}
                onEdit={(alumno)=> handleCambiarRol(alumno)}
                onDelete={(alumno) => deleteUsuarioHandler(alumno._id)} 
              />
            )}

            {activeTab === "profesores" && (
              <AdminTable 
                data={filteredData.profesores} 
                columns={usuarioColumns} 
                onEdit={(profe) => handleCambiarRol(profe)}
                onDelete={(profe) => deleteUsuarioHandler(profe._id)} 
              />
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default AdminPage;