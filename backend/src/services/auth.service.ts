import Usuario from '../models/usuario.schema';
import bcryptjs from 'bcryptjs';
import HttpError from '../utils/httpError';

const loginService = async (email: string, password: string) => {
  try {
    const user = await Usuario.findOne({ email });
    if (!user) {
      return null;
    }
    const comparePassword = user.passwordHash;
    if (!comparePassword) {
      return null;
    }
    const isValid = await bcryptjs.compare(password, comparePassword);
    if (!isValid) {
      return null;
    }
    return user;
  } catch  {
    throw new HttpError('Usuaio o contraseña no identificados', 200);
  }
};

export default loginService;
