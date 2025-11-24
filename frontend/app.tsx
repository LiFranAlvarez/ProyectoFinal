import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './src/pages/homePage';
import Header from './src/components/header';
import Footer from './src/components/footer';
import RegisterPage from './src/pages/registroPages';
import LoginPage from "./src/pages/loginPages";

const App = () => {
  return (
      <Router>
      <Header />
      <main style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;

