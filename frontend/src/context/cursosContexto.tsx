import { createContext, useContext, useEffect, useState } from "react";
import { Curso } from "../types/cursoType";
import { getCursos } from "../services/cursoServices";

type CursosContextType = {
  cursos: Curso[];
  loading: boolean;
  error: string | null;
};

const CursosContext = createContext<CursosContextType | undefined>(undefined);

export const CursosProvider = ({ children }: { children: React.ReactNode }) => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCursos()
      .then(data => setCursos(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CursosContext.Provider value={{ cursos, loading, error }}>
      {children}
    </CursosContext.Provider>
  );
};

export const useCursos = () => {
  const context = useContext(CursosContext);
  if (!context) throw new Error("useCursos debe usarse dentro de CursosProvider");
  return context;
};
