import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginSchema } from "../../utils/validaciones/validacionesLogin";
import { login } from '../../services/authServices';
import { AuthContext } from '../../context/authContexto';


const decodeJwt = (token: string) => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as { rol?: string; _id?: string };
    console.log(decoded)
  } catch {
    return null;
  }
};
import "../../styles/forms.css";


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

    // Validación con Zod
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
      const resp = response as { token?: string; message?: string };
      const token = resp.token;
      if (!token) throw new Error("Token no recibido");

      const decoded = decodeJwt(token);
      const role = decoded?.rol;
      const userId = decoded?._id;

      auth?.login(token);
      if (userId) localStorage.setItem('userId', String(userId));
      setLoginSuccess(true);

      setTimeout(() => {
        if (role && (role.includes("alum") || role === "alumno")) {
          navigate("/dashboard/alumno");
        } else if (role && (role.includes("prof") || role === "profesor" || role === "maestro")) {
          navigate("/dashboard/maestro");
        } else if (role && role.includes("admin")) {
          navigate("/dashboard/admin");
        } else {
          navigate("/");
        }
      }, 800);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message || "Error al iniciar sesión");
      } else {
        setServerError("Error desconocido");
      }
    } finally {
      setIsLoading(false);
    }
  };


   return (
    <form onSubmit={handleSubmit} className="forms">
      <h2>Iniciar sesión</h2>

      <label>Ingrese su email:</label>
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
      />
      {fieldErrors.email && <p style={{ color: "red" }}>{fieldErrors.email}</p>}

      <label>Ingrese su contraseña:</label>
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
      />
      {fieldErrors.password && <p style={{ color: "red" }}>{fieldErrors.password}</p>}

      {serverError && <p style={{ color: "red" }}>{serverError}</p>}
      {loginSuccess && <p style={{ color: "green" }}>Inicio de sesión correcto</p>}

      <button type="submit" className="boton-formulario" disabled={isLoading}>
        {isLoading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
};

export default LoginForm;

