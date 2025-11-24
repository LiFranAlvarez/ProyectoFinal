import axios from 'axios';
//llamada al backend para los logins
export const login = async (data: { email: string; password: string }) => {
  try {
    const res = await axios.post('/api/auth/login', data);
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const msg = err.response?.data?.message || 'Error desconocido';
    throw new Error(msg);
  }
};