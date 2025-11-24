import React, { useState } from 'react';
import { UserRegisterData } from '../types/userType';
import { isEmailValid, isPasswordStrong } from '../utils/validacionesRegistro';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<UserRegisterData>({
    nombre: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    if (!formData.nombre.trim()) newErrors.push("El nombre es obligatorio.");
    if (!isEmailValid(formData.email)) newErrors.push("El email es invalido.");
    if (!isPasswordStrong(formData.password)) newErrors.push("La contraseña es debil.");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setSubmitted(false);
    } else {
      setErrors([]);
      setSubmitted(true);
      console.log("Registro exitoso!", formData);
    }
  };

  return (
  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem', background: '#c1d5ef', border: '1px solid #ccc', maxWidth: '400px', margin: '2rem auto', fontFamily: 'Montserrat' }}>
    <h2>Bienvenido!</h2>
    <label>Ingrese su nombre:</label>
    <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} />
    <label>Ingrese su email:</label>
    <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} />
    <label>Ingrese su contraseña:</label>
    <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} />
    <button type="submit">Registrarse</button>

    {errors.length > 0 && (
      <ul style={{ color: 'red' }}>
        {errors.map((err, i) => <ul key={i}>{err}</ul>)}
      </ul>
    )}

    {submitted && <p style={{ color: 'green' }}>Registro exitoso (simulado)</p>}
  </form>
);
};

export default RegisterForm;
