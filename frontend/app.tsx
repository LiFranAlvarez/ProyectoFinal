import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './src/pages/homePage';
import Header from './src/components/layout/header';
import Footer from './src/components/layout/footer';
import RegisterPage from './src/pages/registroPages';
import LoginPage from "./src/pages/loginPages";
import CatalogoCursos from './src/pages/catalogoCursos';
import CrearCurso from './src/pages/crearCurso';
import CursoDetalle from './src/pages/cursosDetallesPage';
import PerfilUsuario from './src/pages/perfilPages';
import AdminPage from './src/pages/adminPage'; 
import EditarCurso from './src/pages/editarCurso';

const App = () => {
  return (
    <Router>
      <Header />
      <main style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/cursos" element={<CatalogoCursos/>} />
          <Route path="/admin/cursos/crear" element={<CrearCurso/>}/>
          <Route path="/cursos/:idCurso" element={<CursoDetalle/>}/>
          <Route path="/admin/cursos/editar/:idCurso" element={<EditarCurso/>}/>
          <Route path="/perfil" element={<PerfilUsuario/>}/>
          <Route path="/admin" element={<AdminPage/>}/> 
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
