import { useState } from 'react';
import { loginSchema } from '../utils/validacionLogin';
import { login } from '../services/authServices';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<{ email?: string ; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

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

    const parsedErrors = {
      email: rawErrors.email?.[0],
      password: rawErrors.password?.[0],
    };

    setFieldErrors(parsedErrors);
    return;
  };

    try {
      const response = await login(formData);
      localStorage.setItem('token', response.token);
      // Redirigir según rol
      switch (response.user.rol) {
        case 'alumno':
          navigate('/dashboard/alumno');
          break;
        case 'maestro':
          navigate('/dashboard/maestro');
          break;
        case 'admin':
          navigate('/dashboard/admin');
          break;
        default:
          navigate('/');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message || 'Error al iniciar sesión');
      } else {
        setServerError('Error desconocido');
      }
}
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem', background: '#c1d5ef', border: '1px solid #ccc', maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Iniciar sesión</h2>

      <label>Email</label>
      <input name="email" type="email" value={formData.email} onChange={handleChange} />
      {fieldErrors.email && <p>{fieldErrors.email}</p>}
      <label>Contraseña</label>
      <input name="password" type="password" value={formData.password} onChange={handleChange} />
      {fieldErrors.password && <p>{fieldErrors.password}</p>}
      {serverError && <p>{serverError}</p>}
      <button type="submit">Ingresar</button>
    </form>
  );
};


export default LoginForm;