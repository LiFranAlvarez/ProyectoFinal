import { Link } from 'react-router-dom';
const Header = () => {
  return (
    <header style={{ background: "#c1d5ef", color: '#fff', padding: '1rem' ,}}>
        <div style={{marginTop: '0.2rem', display:"flex",alignItems:"center", justifyContent:"space-between"}}>
            <img src="src/assets/icons/logo.png" alt="Logo" style={{ height: '50px', borderRadius:"100px" }} />
            <nav >
                <Link to="/">Home</Link> <Link to="/registro">Registro</Link> <Link to="/auth/login">Login</Link>
            </nav>
        </div>
    </header>
  );
};

export default Header;
