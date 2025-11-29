import ReactDOM from 'react-dom/client';
import App from '../App';
import { StrictMode } from 'react';
import { BusquedaProvider } from './context/busquedaContexto';
import { AuthProvider } from './context/authProviderContexto';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BusquedaProvider>
        <App />
      </BusquedaProvider>
    </AuthProvider>
  </StrictMode>
);
