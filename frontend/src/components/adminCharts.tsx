import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface Props {
  cursos: any[];
  inscripciones: any[];
}

const AdminCharts = ({ cursos, inscripciones }: Props) => {
  // 1. Preparar datos para gráfico de barras: Alumnos por curso
  const dataCursos = cursos.map(c => ({
    nombre: c.titulo.length > 15 ? c.titulo.substring(0, 12) + "..." : c.titulo,
    alumnos: inscripciones.filter(i => (i.cursoId?._id || i.cursoId) === c._id).length
  }));

  const COLORS = ['#4a89ff', '#1a237e', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="charts-container">
      {/* Gráfico de Barras */}
      <div className="chart-box">
        <h3>Inscripciones por Curso</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataCursos}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip cursor={{fill: '#f5f5f5'}} />
            <Bar dataKey="alumnos" fill="#4a89ff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Torta (Opcional) */}
      <div className="chart-box">
        <h3>Popularidad Relativa</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dataCursos}
              dataKey="alumnos"
              nameKey="nombre"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {dataCursos.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminCharts;