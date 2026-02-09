/* eslint-disable @typescript-eslint/no-explicit-any */
import { Curso } from "../types/cursoType"; 
import { Clase } from "../types/claseType"; 
import { Material } from "../types/materialType"; 
import { useContext , useState, useEffect} from "react"; 
import { AuthContext } from "../context/authContexto"; 
import { 
  getCursosByUser, 
  inscribirCurso, 
  abandonarCurso, 
  finalizarCursoProfesor 
} from "../services/inscripcionesServices"; 
import { updateCurso } from "../services/cursoServices"; 
import { deleteClase, createClase } from "../services/claseServices"; 
import { deleteMaterial, createMaterial } from "../services/materialServices"; 
import {  EstadoInscripcion } from "../types/inscripcionType"; 
import "../styles/cursoVista.css"; 

type Props = {
   curso: Curso, 
  }

const CursoDetalle: React.FC<Props> = ({ curso: cursoInicial }) => {
  const auth = useContext(AuthContext); 
  const usuario = auth?.user;
  const [curso, setCurso] = useState<Curso>(cursoInicial);
  const [isEditing, setIsEditing]=useState(false);
  const [estado, setEstado] = useState<EstadoInscripcion | "NO_INSCRIPTO">("NO_INSCRIPTO");
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [showFormClase, setShowFormClase] = useState(false);
  const [showFormMaterial, setShowFormMaterial] = useState(false);
  const [formClase, setFormClase] = useState({ titulo: "", linkGrabacion: "", estado: "PENDIENTE" });
  const [formMaterial, setFormMaterial] = useState({ titulo: "", tipo: "PDF", enlace: "" });
 
  const profesorObj = typeof curso.profesor === "object" ? curso.profesor : null;
  const profesorId = profesorObj ? profesorObj._id : curso.profesor;
  
  const esProfesor = usuario?.rol?.toUpperCase() === "PROFESOR";
  const puedeEditar = esProfesor && usuario?._id === profesorId;
  const esAdmin = usuario?.rol?.toUpperCase() === "ADMIN";
  const esAlumno = usuario?.rol?.toUpperCase() === "ALUMNO";

  useEffect(() => { 
    if (!usuario || !esAlumno) return; 
    
    getCursosByUser(usuario._id!)
      .then(inscripciones => {
        const inscripcionEncontrada = inscripciones.find(i => {
          const cursoEnInscripcion = (i as any).cursoId; 
          const cursoInscritoId = typeof cursoEnInscripcion === 'object' ? cursoEnInscripcion._id : cursoEnInscripcion;
          return cursoInscritoId === curso._id;
        });

        if (!inscripcionEncontrada) return setEstado("NO_INSCRIPTO");
        setEstado((inscripcionEncontrada as any).estadoInscripcion); 
      })
      .catch(error => {
          console.error("Error al cargar estado de inscripción:", error);
          setEstado("NO_INSCRIPTO"); 
      });
  }, [usuario, curso._id, esAlumno]);

  const handleActualizarCurso = async () => {
    try {
      // Usando updateCurso del servicio
      await updateCurso(curso._id!, curso);
      alert('Curso actualizado exitosamente');
      setIsEditing(false);
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const handleAgregarClase = async () => {
    try {
      if (!formClase.titulo.trim()) return alert('El título es requerido');

      const payload = { ...formClase, cursoId: curso._id };
      // Usando createClase del servicio
      const nuevaClase = await createClase(payload as any);
      
      setCurso({...curso, clases: [...(curso.clases || []), nuevaClase]});
      setFormClase({ titulo: "", linkGrabacion: "", estado: "PENDIENTE" });
      setShowFormClase(false);
      alert('Clase agregada exitosamente');
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const handleAgregarMaterial = async () => {
    try {
      if (!formMaterial.titulo.trim() || !formMaterial.enlace.trim()) return alert('Requeridos');

      const payload = { ...formMaterial, cursoId: curso._id };
      // Usando createMaterial del servicio
      const nuevoMaterial = await createMaterial(payload as any);

      setCurso({...curso, materiales: [...(curso.materiales || []), nuevoMaterial]});
      setFormMaterial({ titulo: "", tipo: "PDF", enlace: "" });
      setShowFormMaterial(false);
      alert('Material agregado exitosamente');
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const handleAgregarCategoria = () => {
    if(nuevaCategoria.trim() && !curso.categorias?.includes(nuevaCategoria)){
      setCurso({...curso, categorias:[...(curso.categorias ?? []), nuevaCategoria]});
      setNuevaCategoria("");
    }
  };

  const handleEliminarCategoria = (cat: string) => {
    setCurso({...curso, categorias: curso.categorias?.filter(c=>c!==cat)})
  };

  const handleInscribirse = async () => { 
    if (!usuario || !curso._id) return alert("Inicia sesión."); 
    try { 
      await inscribirCurso(curso._id, usuario._id); 
      setEstado("EN_PROCESO"); 
      alert("¡Inscripción exitosa!"); 
    } catch (error) { 
      alert(`Error: ${(error as Error).message}`); 
    }
  };

  const handleEliminarClase = async (idClase: string) => {
    if (!window.confirm("¿Eliminar clase?")) return;
    try {
      await deleteClase(idClase, curso._id);
      setCurso({...curso, clases: curso.clases?.filter(c => c._id !== idClase)});
      alert('Clase eliminada');
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const handleEliminarMaterial = async (idMaterial: string) => {
    if (!window.confirm("¿Eliminar material?")) return;
    try {
      await deleteMaterial(idMaterial, curso._id);
      setCurso({...curso, materiales: curso.materiales?.filter(m => m._id !== idMaterial)});
      alert('Material eliminado');
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const handleAbandonar = async () => { 
    if (!usuario || !curso._id) return;
    if (!window.confirm("¿Abandonar curso?")) return;
    try { 
      await abandonarCurso(curso._id!, usuario._id!); 
      setEstado("ABANDONADA"); 
      alert("Has abandonado el curso.");
    } catch (error) { 
      alert(`Error: ${(error as Error).message}`); 
    } 
  };

  const handleFinalizarProfesor = async () => { 
    if (!usuario || !curso._id) return;
    if (!window.confirm("¿Finalizar curso?")) return;
    try { 
      await finalizarCursoProfesor(curso._id!); 
      alert("Curso finalizado.");
      window.location.reload();
    } catch (error) { 
      alert(`Error: ${(error as Error).message}`); 
    } 
  };

  const contenidoVisible = esAdmin || puedeEditar || (esAlumno && estado !== "NO_INSCRIPTO");

  return (
    <div className="curso-detalle-container">
      <header className="curso-header-centered">
        <h1 className="curso-titulo">
          {isEditing ? (
            <input 
              type="text"
              value={curso.titulo}
              onChange={(e) => setCurso({...curso, titulo: e.target.value})}
              className="input-editable-titulo"
            />
          ) : curso.titulo}
        </h1> 

        <p className="curso-descripcion">
          {isEditing ? (
            <textarea 
              value={curso.descripcion || ''}
              onChange={(e) => setCurso({...curso, descripcion: e.target.value})}
              className="input-editable-descripcion"
            />
          ) : curso.descripcion || "Sin descripción disponible"}
        </p> 

        <p className="curso-docente">
          Docente: <strong>{typeof curso.profesor === "string" ? curso.profesor : curso.profesor?.nombre || "Sin Asignar"}</strong>
        </p>

        <div className="curso-categorias">
          <p className="categorias-label"><strong>Etiquetas:</strong></p>
          <div className="chips">
            {curso.categorias?.map(cat=>(
              <span key={cat} className="chip">
                {cat} 
                {isEditing && <b onClick={()=>handleEliminarCategoria(cat)}>×</b>}
              </span>
            ))}
          </div>
          {isEditing && (
            <div className="agregar-categoria">
              <input 
                type="text"
                value={nuevaCategoria}
                onChange={(e)=>setNuevaCategoria(e.target.value)}
                placeholder="Nueva etiqueta..."
              />
              <button onClick={handleAgregarCategoria} type="button">Agregar</button>
            </div>
          )}
        </div>

        {(puedeEditar || esAdmin) && (
          <div className="btn-group-profesor">
            <button 
              onClick={() => isEditing ? handleActualizarCurso() : setIsEditing(true)}
              className={isEditing ? 'btn-guardar-edicion' : 'btn-editar-curso'}
            >
              {isEditing ? "💾 Guardar Cambios" : "✏️ Editar Curso"}
            </button>
            {isEditing && <button onClick={() => setIsEditing(false)} className='btn-cancelar-edicion'>❌ Cancelar</button>}
          </div>
        )}
      </header>

      {esAlumno && (
        <div className="alumno-acciones">
          {estado === "NO_INSCRIPTO" && (
            <button onClick={handleInscribirse} className="btn-inscripcion">Inscribirme al Curso</button>
          )}
          {(estado !== "NO_INSCRIPTO") && (
            <p className="estado-actual"><strong>Estado:</strong> {estado.replace('_', ' ')}</p>
          )}
          {estado === "EN_PROCESO" && <button onClick={handleAbandonar} className="btn-abandonar">Abandonar</button>}
          {estado === "ABANDONADA" && <button onClick={handleInscribirse} className="btn-reinscribir">🔄 Reinscribirme</button>}
        </div>
      )}

      {puedeEditar && curso.estado !== "COMPLETADO" && (
        <div className="profesor-acciones">
          <button onClick={handleFinalizarProfesor} className="btn-finalizar-curso">✅ Finalizar Curso</button>
        </div>
      )}
            
      <div className="curso-contenido-wrapper">
        {contenidoVisible ? (
          <>
            <section className="seccion-clases">
              <h2>📚 Clases ({curso.clases?.length || 0})</h2>
              {isEditing && (
                <div className="form-agregar-clase">
                  {!showFormClase ? (
                    <button onClick={() => setShowFormClase(true)} className="btn-agregar">➕ Nueva Clase</button>
                  ) : (
                    <div className="form-inline">
                      <input placeholder="Título" value={formClase.titulo} onChange={e => setFormClase({...formClase, titulo: e.target.value})}/>
                      <select value={formClase.estado} onChange={e => setFormClase({...formClase, estado: e.target.value})}>
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="DISPONIBLE">DISPONIBLE</option>
                      </select>
                      <input placeholder="Link" value={formClase.linkGrabacion} onChange={e => setFormClase({...formClase, linkGrabacion: e.target.value})}/>
                      <button onClick={handleAgregarClase} className="btn-guardar">Crear</button>
                      <button onClick={() => setShowFormClase(false)} className="btn-cancelar">Cancelar</button>
                    </div>
                  )}
                </div>
              )}
              <ul className="clases-list">
                {curso.clases?.map((clase:Clase) => (
                  <li key={clase._id} className="clase-row">
                    <small className="clase-fecha">{clase.fecha ? new Date(clase.fecha).toLocaleDateString(): "S/F"}</small>
                    <div className="clase-link">
                      <label>Link de Grabación</label>
                      <input defaultValue={clase.linkGrabacion || ''} disabled={!puedeEditar || !isEditing} className={isEditing ? 'input-editable' : 'input-readonly'}/>
                      {isEditing && <button onClick={() => handleEliminarClase(clase._id!)} className="btn-eliminar-clase">🗑️</button>}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
    
            <section className="seccion-materiales">
              <h2>📎 Materiales ({curso.materiales?.length || 0})</h2>
              {isEditing && (
                <div className="form-agregar-material">
                  {!showFormMaterial ? (
                    <button onClick={() => setShowFormMaterial(true)} className="btn-agregar">➕ Nuevo Material</button>
                  ) : (
                    <div className="form-inline">
                      <input placeholder="Título" value={formMaterial.titulo} onChange={e => setFormMaterial({...formMaterial, titulo: e.target.value})}/>
                      <select value={formMaterial.tipo} onChange={e => setFormMaterial({...formMaterial, tipo: e.target.value})}>
                        <option value="PDF">PDF</option>
                        <option value="VIDEO">VIDEO</option>
                        <option value="ENLACE">ENLACE</option>
                      </select>
                      <input placeholder="URL" value={formMaterial.enlace} onChange={e => setFormMaterial({...formMaterial, enlace: e.target.value})}/>
                      <button onClick={handleAgregarMaterial} className="btn-guardar">Crear</button>
                      <button onClick={() => setShowFormMaterial(false)} className="btn-cancelar">Cancelar</button>
                    </div>
                  )}
                </div>
              )}
              <div className="materiales-grid">
                {curso.materiales?.map((m: Material) => (
                  <div key={m._id} className="material-item-row">
                    <a href={m.enlace} target="_blank" rel="noopener noreferrer">
                      <small className="material-fecha">{m.fechaSubida ? new Date(m.fechaSubida).toLocaleDateString(): m.tipo}</small>
                    </a>
                    {isEditing && <button onClick={() => handleEliminarMaterial(m._id!)} className="btn-eliminar-material">Eliminar</button>}
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <p className="bloqueo-contenido">🔒 Debes inscribirte para acceder al contenido.</p>
        )}
      </div>
    </div>
  );
};

export default CursoDetalle;