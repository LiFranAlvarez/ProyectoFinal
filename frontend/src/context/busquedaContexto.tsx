import { createContext, useContext, useState, useCallback } from 'react';
import { CursoFiltro } from '../types/filtrosCursosType';

type BusquedaContextType = {
  filtro: CursoFiltro;
  // Usamos Partial para poder actualizar solo una parte del filtro si fuera necesario
  setFiltro: (val: CursoFiltro) => void;
  resetFiltro: () => void;
};

const BusquedaContext = createContext<BusquedaContextType | undefined>(undefined);

export const BusquedaProvider = ({ children }: { children: React.ReactNode }) => {
  // Inicializamos con un objeto que contenga texto vacío para evitar errores de undefined
  const [filtro, setFiltro] = useState<CursoFiltro>({ texto: "" });

  // useCallback evita que la función se recree innecesariamente, mejorando el rendimiento
  const resetFiltro = useCallback(() => {
    setFiltro({ texto: "" });
  }, []);

  return (
    <BusquedaContext.Provider value={{ filtro, setFiltro, resetFiltro }}>
      {children}
    </BusquedaContext.Provider>
  );
};

export const useBusqueda = () => {
  const context = useContext(BusquedaContext);
  if (!context) {
    throw new Error('useBusqueda debe usarse dentro de BusquedaProvider');
  }
  return context;
};