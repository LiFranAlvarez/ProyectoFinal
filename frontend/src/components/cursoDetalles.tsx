/* eslint-disable @typescript-eslint/no-explicit-any */
import { Curso } from "../types/cursoType"; 
import { Clase } from "../types/claseType"; 
import { Material } from "../types/materialType"; 
import { useContext , useState, useEffect} from "react"; 
import { AuthContext } from "../context/authContexto"; 
import { useNavigate } from "react-router-dom"; 
import { getCursosByUser, inscribirCurso, abandonarCurso, completarCurso } from "../services/inscripcionesServices"; 
import { Inscripcion, EstadoInscripcion } from "../types/inscripcionType"; 
import "../styles/cursoVista.css"; 

type Props = {
   curso: Curso, 
  }
const CursoDetalle: React.FC<Props> = ({ curso }) => {
  const auth = useContext(AuthContext); 
  const usuario = auth?.user; 
  const navigate =useNavigate(); 
  const [isEditing, setIsEditing]=useState(false);
  const [estado, setEstado] = useState<EstadoInscripcion | "NO_INSCRIPTO">("NO_INSCRIPTO");
 
    const profesorObj = typeof curso.profesor === "object" ? curso.profesor : null;
    const profesorId = profesorObj ? profesorObj._id : curso.profesor;
    
    const esProfesor = usuario?.rol?.toUpperCase() === "PROFESOR";
    const puedeEditar = esProfesor && usuario?._id === profesorId;
    const esAdmin = usuario?.rol?.toUpperCase() === "ADMIN";
    const esAlumno = usuario?.rol?.toUpperCase() === "ALUMNO";
  
  useEffect(() => { 
    if (!usuario || !esAlumno) {
      return
    } 
    
    (getCursosByUser(usuario._id!) as Promise<Inscripcion[]>)
      .then(inscripciones => {
        
        const inscripcionEncontrada = inscripciones.find(i => {
          
          const cursoEnInscripcion = (i as any).cursoId; 
          
          let cursoInscritoId: string | undefined;

          if (cursoEnInscripcion && typeof cursoEnInscripcion === 'object') {
              cursoInscritoId = cursoEnInscripcion._id; 
          } else if (typeof cursoEnInscripcion === 'string') {
              cursoInscritoId = cursoEnInscripcion;
          }

          return cursoInscritoId === curso._id;
        });

        if (!inscripcionEncontrada) {
          return setEstado("NO_INSCRIPTO");
        }

        setEstado((inscripcionEncontrada as any).estadoInscripcion); 
      })
      .catch(error => {
          console.error("Error al cargar estado de inscripción:", error);
          setEstado("NO_INSCRIPTO"); 
      });
      
  }, [usuario, curso._id, esAlumno]);
  const handleInscribirse = async () => { 
    console.log("Intentando inscribirse:", { 
      cursoId: curso._id, usuarioId: usuario?._id 
    }); 
    if (!usuario || !curso._id) { 
      alert("Necesitas iniciar sesión para inscribirte."); 
      return; 
    } try { 
        await inscribirCurso(curso._id, usuario._id); 
        setEstado("EN_PROCESO"); 
        alert("¡Inscripción exitosa!"); 
    } catch (error) { 
        console.error("Error al inscribirse:", error); 
        
        alert(`Error al inscribirse: ${(error as Error).message}`); 
    }
  };
  const handleAbandonar = async () => { 
    if (!usuario || !curso._id) { 
      alert("No se pudo procesar la solicitud. Usuario no identificado."); 
      return; 
    } try { 
      await abandonarCurso(curso._id!, usuario._id!); 
      setEstado("ABANDONADA"); 
    } catch (error) { 
      console.error("Error al abandonar:", error); 
      alert("Hubo un error al abandonar el curso."); 
    } 
  };
  const handleTerminar = async () => { 
    if (!usuario || !curso._id) { 
      alert("No se pudo procesar la solicitud. Usuario no identificado."); 
      return; } try { 
        await completarCurso(curso._id!, usuario._id!); 
        setEstado("TERMINADA"); 
      } catch (error) { 
          console.error("Error al finalizar:", error); 
          alert("Hubo un error al finalizar el curso."); 
        } 
  }; 
  const contenidoVisible =
  esAdmin ||
  puedeEditar ||
  (esAlumno && estado !== "NO_INSCRIPTO");

  return (
    <div className="curso-detalle-container">
      <header className="curso-header-centered">
        <h1 className="curso-titulo">{curso.titulo}</h1> 
          <p className="curso-descripcion">{curso.descripcion || "Sin descripción disponible"}</p> 
          <p className="curso-docente">Docente: <strong>{typeof curso.profesor === "string" ? curso.profesor : curso.profesor?.nombre || "Sin Asignar"}</strong></p>
                
          {(puedeEditar || esAdmin) && (
            <div className="btn-group-profesor">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={isEditing ? 'btn-cancelar-edicion' : 'btn-editar-curso'}
            >
              {isEditing ? "❌ Finalizar Edición" : "✏️ Editar Curso"}
            </button>
            </div>
          )}
          {isEditing && (
            <div className="btn-group-acciones">
              <button onClick={() => navigate(`/editar/curso/${curso._id}`)}>Editar Datos</button>
              <button onClick={() => navigate(`/curso/${curso._id}/nueva-clase`)}>Agregar Clase</button>
              <button onClick={() => navigate(`/curso/${curso._id}/nuevo-material`)}> Agregar Material</button>
              <button className="btn-cancelar-edicion">🗑 Eliminar Curso</button>
            </div>
          )}
      </header>
      {esAlumno && (
        <div className="alumno-acciones">
          {estado === "NO_INSCRIPTO" && (
            <button onClick={handleInscribirse} className="btn-inscripcion">
              Inscribirme al Curso
            </button>
          )}

          {(estado === "EN_PROCESO" || estado === "ABANDONADA" || estado === "TERMINADA") && (
            <p className="estado-actual">
              <strong>Estado:</strong> {estado.replace('_', ' ')}
            </p>
          )}

          {estado === "EN_PROCESO" && (
            <div className="alumno-opciones">
               <button onClick={handleAbandonar} className="btn-abandonar">Abandonar</button>
              <button onClick={handleTerminar} className="btn-finalizar">Finalizar curso</button>
             </div>
          )}
                    
          {estado === "ABANDONADA" && (
            <button onClick={handleInscribirse} className="btn-reinscribir">🔄 Reinscribirme</button>
          )}
        </div>
      )}
            
        <div className="curso-contenido-wrapper">
          {contenidoVisible ? (
            <>
              <section className="seccion-clases">
                <h2>📚 Clases ({curso.clases?.length || 0})</h2>
                <ul className="clases-list">
                  {curso.clases?.map((clase:Clase) => (
                    <li key={clase._id} className="clase-row">
                        <small className="clase-fecha">
                          {clase.fecha ? new Date(clase.fecha).toLocaleDateString(): "Fecha sin asignar"}
                        </small>
                      <div className="clase-link">
                        <label>Link de Grabación</label>
                            <input 
                              type="text"
                              defaultValue={clase.linkGrabacion || ''}
                              placeholder="URL del video de la clase"
                              disabled={!puedeEditar || !isEditing}
                              className={isEditing ? 'input-editable' : 'input-readonly'}
                            />
                              {isEditing && (
                                <button className="btn-eliminar-clase">🗑️</button>
                            )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
    
              <section className="seccion-materiales">
                <h2>📎 Materiales ({curso.materiales?.length || 0})</h2>
                <div className="materiales-grid">
                  {curso.materiales?.map((m: Material) => (
                    <div key={m._id} className="material-item-row">
                      <a href={m.enlace} target="_blank" rel="noopener noreferrer">
                          <small className="material-fecha">
                            {m.fechaSubida ? new Date(m.fechaSubida).toLocaleDateString(): (m.tipo || '')}
                          </small>
                      </a>
                      {isEditing && (
                        <button className="btn-eliminar-material">Eliminar</button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
                    <p className="bloqueo-contenido">
                        🔒 Debes inscribirte para acceder a las clases y materiales.
                    </p>
          )}
        </div>

    </div>
    );
};

export default CursoDetalle;