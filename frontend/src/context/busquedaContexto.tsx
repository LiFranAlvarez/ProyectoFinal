import { createContext, useContext, useState } from 'react';
import  {CursoFiltro}  from '../types/filtrosCursosType';

type BusquedaContextType = {
  filtro: CursoFiltro;
  setFiltro: (val: CursoFiltro) => void;

};

const BusquedaContext = createContext<BusquedaContextType | undefined>(undefined);

export const BusquedaProvider = ({ children }: { children: React.ReactNode }) => {
  const [filtro, setFiltro] = useState<CursoFiltro>({});
  return (
    <BusquedaContext.Provider value={{ filtro, setFiltro }}>
      {children}
    </BusquedaContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useBusqueda = () => {
  const context = useContext(BusquedaContext);
  if (!context) throw new Error('useBusqueda debe usarse dentro de BusquedaProvider');
  return context;
};
