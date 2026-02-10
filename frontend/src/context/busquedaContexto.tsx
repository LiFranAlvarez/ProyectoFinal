import { createContext, useContext, useState, useCallback } from 'react';
import { CursoFiltro } from '../types/filtrosCursosType';

type BusquedaContextType = {
  filtro: CursoFiltro;
  setFiltro: (val: CursoFiltro) => void;
  resetFiltro: () => void;
};

const BusquedaContext = createContext<BusquedaContextType | undefined>(undefined);

export const BusquedaProvider = ({ children }: { children: React.ReactNode }) => {
  const [filtro, setFiltro] = useState<CursoFiltro>({ texto: "" });
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