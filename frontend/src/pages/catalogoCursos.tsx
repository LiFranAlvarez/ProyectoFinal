/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useBusqueda } from '../context/busquedaContexto';
import { Curso } from '../types/cursoType';
import CursoCard from '../components/catalogo/cursoCard';


const CatalogoCursos = () => {
  const { filtro } = useBusqueda();
  const [todosLosCursos, setTodosLosCursos] = useState<Curso[]>([]);
  const [resultados, setResultados] = useState<Curso[]>([]);

  useEffect(() => {
    const cargarCursos = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/cursos');

        if (!res.ok) throw new Error("No se pudieron obtener los cursos");

        const data = await res.json();
        const normalizados = data.map((c: any) => ({
          ...c,
          descripcion: c.descripcion || c.describe || "", // 👈 asegura que siempre haya algo
        }));
        setTodosLosCursos(normalizados);
        setResultados(normalizados);

      } catch (error) {
        console.error('Error al cargar cursos:', error);
      }
    };

    cargarCursos();
  }, []);

  useEffect(() => {
    const texto = filtro.texto?.toLowerCase() || "";

    const filtrados = todosLosCursos.filter((curso) => {
      
      const textoMatch =
        !texto ||
        curso.titulo.toLowerCase().includes(texto) ||
        curso.descripcion?.toLowerCase().includes(texto) ||
        Array.isArray(curso.categorias) && curso.categorias.some(cat => cat.toLowerCase().includes(texto)) ||
        (typeof curso.profesor === "object" && curso.profesor?.nombre?.toLowerCase().includes(texto));


      const categoriaMatch =
        !filtro.categoria ||
        curso.categorias?.includes(filtro.categoria);

      const docenteMatch =
      !filtro.profesor ||
      (typeof curso.profesor === "object" && curso.profesor?._id === filtro.profesor) ||
      (typeof curso.profesor === "string" && curso.profesor === filtro.profesor);

      return textoMatch && categoriaMatch && docenteMatch;
    });

    setResultados(filtrados);
  }, [filtro, todosLosCursos]);

  return (
    <main style={{ background: "#c1d5ef", color: '#000000ff', padding: '1rem' }}>
      <h2>Catálogo de Cursos</h2>

      {resultados.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {resultados.map((curso) => (
            <CursoCard key={curso._id} curso={curso} />
          ))}
        </div>
      ) : (
        <p>No se encontraron cursos para "{filtro.texto}"</p>
      )}
    </main>
  );
};

export default CatalogoCursos;
