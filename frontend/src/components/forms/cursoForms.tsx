import { useState, useEffect} from 'react';
import { Curso } from "../../types/cursoType"
import { cursoSchema } from '../../utils/validaciones/validacionesCursos';
import "../../styles/forms.css";
import { getUsuarios } from '../../services/usuarioServices';
type Props = {
  cursoInicial?: Curso;
  onSubmit: (curso: Curso) => void;
};

const SUGERIDAS = ["programación","matemáticas","idiomas","diseño","backend","frontend"];

const CursoForm = ({ cursoInicial, onSubmit }: Props) => {
  const [formData, setFormData] = useState<Curso>(
    cursoInicial ?? 
    {
      titulo:"",
      descripcion:"",       
      profesor: "",
      categorias:[],
      clases:[],
      materiales:[]
    }
  );

  const [errors, setErrors] = useState<{ [key:string]:string }>({});
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [profesores, setProfesores] = useState<{ _id: string; nombre?: string }[]>([]);

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const usuarios = await getUsuarios();
        const soloProfesores = usuarios.filter((u: any) => u.rol === "PROFESOR");  
        console.log("Profesores cargados:", soloProfesores);
        setProfesores(soloProfesores); 
      } catch (err) {
        console.error("Error cargando profesores", err);
      }
    };
    fetchProfesores();
  }, []);

  const handleAddCategoria = () => {
    if(nuevaCategoria.trim() && !formData.categorias?.includes(nuevaCategoria)){
      setFormData({...formData, categorias:[...(formData.categorias ?? []), nuevaCategoria]});
      setNuevaCategoria("");
    }
  };

  const handleDeleteCategoria = (cat:string)=>{
    setFormData({...formData, categorias: formData.categorias?.filter(c=>c!==cat)})
  };

  const handleSubmit = (e:React.FormEvent)=>{
    e.preventDefault();
    const result = cursoSchema.safeParse(formData);
    if(!result.success){
      const raw = result.error.flatten().fieldErrors;
      setErrors({
        titulo: raw.titulo?.[0] ?? '',
        descripcion: raw.descripcion?.[0] ?? '', 
        categorias: raw.categorias?.[0] ?? '',
        profesor: raw.profesor?.[0] ?? ''
      });
      return;
    }const cursoValido={
      ...formData,
      profesor:  formData.profesor
    }
    onSubmit(cursoValido);   
  };

  return (
    <form onSubmit={handleSubmit} className="forms">
      <h2>{cursoInicial ? "Editar Curso" : "Crear Curso"}</h2>

      <label> Título </label>
      <input name="titulo" value={formData.titulo}
             onChange={e=>setFormData({...formData,titulo:e.target.value})}/>
      {errors.titulo && <p className="error">{errors.titulo}</p>}

      <label> Descripción </label>
      <textarea name="descripcion" value={formData.descripcion}
                onChange={e=>setFormData({...formData,descripcion:e.target.value})}/>
      {errors.descripcion && <p className="error">{errors.descripcion}</p>}
      <label>Profesor</label>
     <select
      name="profesor"
      value={
        typeof formData.profesor === "string"
          ? formData.profesor
          : formData.profesor?._id || ""
      }
      onChange={(e) =>
        setFormData({ ...formData, profesor: e.target.value })
      }
    >
      <option value="">Seleccione un profesor</option>
      {profesores.map((p) => (
        <option key={p._id} value={p._id}>
          {p.nombre ?? p._id}
        </option>
      ))}
    </select>

      <label>Categorías</label>

      <div className="chips">
        {formData.categorias?.map(cat=>(
          <span key={cat} className="chip">{cat} <b onClick={()=>handleDeleteCategoria(cat)}>×</b></span>
        ))}
      </div>

      <input list="cat-list" value={nuevaCategoria}
             placeholder="Agregar categoría..."
             onChange={(e)=>setNuevaCategoria(e.target.value)}/>
      <datalist id="cat-list">
        {SUGERIDAS.map(s=><option key={s} value={s}/>)}
      </datalist>

      <button type="button" onClick={handleAddCategoria}>Agregar</button>

      <button type="submit" className="boton-formulario">
        {cursoInicial ? "Guardar" : "Crear Curso"}
      </button>
    </form>
  );
};

export default CursoForm;
