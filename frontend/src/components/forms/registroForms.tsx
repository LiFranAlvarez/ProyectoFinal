import React, { useState } from 'react';
import { UserRegisterData } from '../../types/userRegistroType';
import { registerSchema } from '../../utils/validaciones/validacionesRegistro';
import "../../styles/forms.css";
import { register } from '../../services/authServices';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContexto';
const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<UserRegisterData>({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{ nombre?: string; email?: string; password?: string; confirmPassword?: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
    setSubmitted(false);
    setServerError(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const rawErrors = result.error.flatten().fieldErrors;
      setErrors({
        nombre: rawErrors.nombre?.[0],
        email: rawErrors.email?.[0],
        password: rawErrors.password?.[0],
        confirmPassword: rawErrors.confirmPassword?.[0],
      });
      setSubmitted(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await register({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        rol:"ALUMNO"
      });
      const resp = response as { token?: string; message?: string };
      const token = resp.token;
      if (typeof token === 'string' && token.length > 0) {
        auth?.login(token);
        setSubmitted(true);
        setTimeout(() => navigate('/perfil'), 1200);
        return;
      }

      if (resp.message || (resp && Object.keys(resp).length > 0)) {
        setSubmitted(true);
        setTimeout(() => navigate('/auth/login'), 1200); 
      } else {
        setServerError('Respuesta inválida del servidor');
      }
    } catch (error) {
      console.error(error);
      setServerError(error instanceof Error ? error.message : 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="forms">
      <h2>Bienvenido!</h2>

      <label>Ingrese su nombre:</label>
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={formData.nombre}
        onChange={handleChange}
      />
      {errors.nombre && <p style={{ color: 'red' }}>{errors.nombre}</p>}

      <label>Ingrese su email:</label>
      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        value={formData.email}
        onChange={handleChange}
      />
      {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

      <label>Ingrese su contraseña:</label>
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={handleChange}
      />
      {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}

      <label>Confirme su contraseña:</label>
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirmar contraseña"
        value={formData.confirmPassword || ''}
        onChange={handleChange}
      />
      {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword}</p>}

      <button type="submit" className="boton-formulario" disabled={isLoading}>
        {isLoading ? 'Registrando...' : 'Registrarse'}
      </button>

      {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
      {submitted && <p style={{ color: 'green' }}>Registro exitoso</p>}
    </form>
  );
};

export default RegisterForm;
