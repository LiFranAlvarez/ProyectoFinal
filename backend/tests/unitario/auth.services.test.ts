import bcryptjs from 'bcryptjs';
import loginService from '../../src/services/auth.service';
import Usuario from '../../src/models/usuario.schema';
import HttpError from '../../src/utils/httpError';

// Mock de las dependencias
jest.mock('bcryptjs');
jest.mock('../../src/models/usuario.schema');

describe('Auth Service - loginService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería retornar null si el usuario no existe', async () => {
    (Usuario.findOne as jest.Mock).mockResolvedValue(null);

    const result = await loginService('user@example.com', 'password123');

    expect(result).toBeNull();
    expect(Usuario.findOne).toHaveBeenCalledWith({ email: 'user@example.com' });
  });

  it('debería retornar null si la contraseña no coincide', async () => {
    const mockUser = {
      _id: '123',
      email: 'user@example.com',
      passwordHash: 'hashedPassword',
      nombre: 'Test User',
      rol: 'ALUMNO',
    };

    (Usuario.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcryptjs.compare as jest.Mock).mockResolvedValue(false);

    const result = await loginService('user@example.com', 'wrongPassword');

    expect(result).toBeNull();
    expect(bcryptjs.compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
  });

  it('debería retornar el usuario si las credenciales son válidas', async () => {
    const mockUser = {
      _id: '123',
      email: 'user@example.com',
      passwordHash: 'hashedPassword',
      nombre: 'Test User',
      rol: 'ALUMNO',
    };

    (Usuario.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcryptjs.compare as jest.Mock).mockResolvedValue(true);

    const result = await loginService('user@example.com', 'password123');

    expect(result).toEqual(mockUser);
    expect(bcryptjs.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
  });

  it('debería lanzar HttpError en caso de error en base de datos', async () => {
    (Usuario.findOne as jest.Mock).mockRejectedValue(new Error('DB Error'));

    await expect(loginService('user@example.com', 'password123')).rejects.toThrow(
      HttpError
    );
  });

  it('debería retornar null si el usuario no tiene passwordHash', async () => {
    const mockUser = {
      _id: '123',
      email: 'user@example.com',
      passwordHash: null,
      nombre: 'Test User',
      rol: 'ALUMNO',
    };

    (Usuario.findOne as jest.Mock).mockResolvedValue(mockUser);

    const result = await loginService('user@example.com', 'password123');

    expect(result).toBeNull();
  });
});
