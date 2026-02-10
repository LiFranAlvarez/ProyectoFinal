import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginSchema } from "../../utils/validaciones/validacionesLogin";
import { login } from '../../services/authServices';
import { AuthContext } from '../../context/authContexto';
import "../../styles/forms.css";

const decodeJwt = (token: string) => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as { rol?: string; id?: string };
  } catch {
    return null;
  }
};

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({});
    setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const rawErrors = result.error.flatten().fieldErrors;
      setFieldErrors({
        email: rawErrors.email?.[0],
        password: rawErrors.password?.[0],
      });
      return;
    }

    try {
      setIsLoading(true);

      const response = await login(formData);

      const token = response.accessToken; 
      
      if (!token) throw new Error("Token no recibido del servidor");

      const decoded = decodeJwt(token);
      const role = decoded?.rol;
      const userId = decoded?.id;

      auth?.login(token);
      if (userId) localStorage.setItem('userId', String(userId));
      
      setLoginSuccess(true);

      setTimeout(() => {
        const r = role?.toUpperCase();
        if (r === "ALUMNO") {
          navigate("/home");
        } else if (r === "PROFESOR") {
          navigate("/home");
        } else if (r === "ADMIN") {
          navigate("/admin"); 
        } else {
          navigate("/");
        }
      }, 800);
    } catch (err: any) {
      setServerError(err.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="forms">
      <h2>Iniciar sesión</h2>

      <label>Email</label>
      <input name="email" type="email" value={formData.email} onChange={handleChange} />
      {fieldErrors.email && <p className="error-text">{fieldErrors.email}</p>}

      <label>Contraseña</label>
      <input name="password" type="password" value={formData.password} onChange={handleChange} />
      {fieldErrors.password && <p className="error-text">{fieldErrors.password}</p>}

      {serverError && <p className="error-text">{serverError}</p>}
      {loginSuccess && <p className="success-text">¡Inicio de sesión correcto!</p>}

      <button type="submit" className="boton-formulario" disabled={isLoading}>
        {isLoading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
};

export default LoginForm;