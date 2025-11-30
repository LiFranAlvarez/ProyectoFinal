import "../../styles/claseCard.css";

type Props = {
  titulo: string;
  fecha: string;
  estado: "DISPONIBLE" | "PENDIENTE";
  materiales: {
    _id: string;
    tipo: string;
    titulo: string;
    enlace: string;
  }[];
};

const ClaseCard: React.FC<Props> = ({ titulo, fecha, estado, materiales }) => {
  return (
    <div className={`clase-card ${estado}`}>
      <h3>{titulo}</h3>
      <p>Fecha: {fecha}</p>
      <span className="estado">
        {estado === "DISPONIBLE" ? "DISPONIBLE" : "PENDIENTE"}
      </span>

      <div className="materiales">
        {materiales.map((mat) => (
          <a key={mat._id} href={mat.enlace} target="_blank" rel="noopener noreferrer">
            📎 {mat.tipo}: {mat.titulo}
          </a>
        ))}
      </div>
    </div>
  );
};

export default ClaseCard;