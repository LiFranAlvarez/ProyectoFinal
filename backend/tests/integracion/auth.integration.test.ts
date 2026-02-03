import request from 'supertest';
import express, { Application } from 'express';
import Jwt from 'jsonwebtoken';

import config from '../../src/config/config';
import signInController from '../../src/controllers/auth.controller';
import signInService from '../../src/services/auth.service';

// Mock del servicio de autenticación
jest.mock('../../src/services/auth.service');

describe('Auth Routes - Integration Tests', () => {
  let app: Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Ruta de login
    app.post('/api/login', signInController);

    jest.clearAllMocks();
  });

  describe('POST /api/login', () => {
    it('debería retornar un token si las credenciales son válidas', async () => {
      const mockUser = {
        id: '123',
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        rol: 'ALUMNO',
      };

      (signInService as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).post('/api/login').send({
        email: 'juan@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.message).toBe('Inicio Sesion Correctamente');

      // Verificar que el token contiene los datos correctos
      const decoded = Jwt.verify(response.body.token, config.SECRET) as any;
      expect(decoded.email).toBe('juan@example.com');
      expect(decoded.nombre).toBe('Juan Pérez');
    });

    it('debería retornar 401 si el usuario no existe', async () => {
      (signInService as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post('/api/login').send({
        email: 'noexiste@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('No se pudo Iniciar Sesion');
    });

    it('debería retornar 401 si la contraseña es incorrecta', async () => {
      (signInService as jest.Mock).mockResolvedValue(null);

      const response = await request(app).post('/api/login').send({
        email: 'juan@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('No se pudo Iniciar Sesion');
    });

    it('debería manejar errores del servidor', async () => {
      (signInService as jest.Mock).mockRejectedValue(
        new Error('Error en base de datos')
      );

      const response = await request(app).post('/api/login').send({
        email: 'juan@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(400);
    });

    it('debería validar que el email sea requerido', async () => {
      const response = await request(app).post('/api/login').send({
        password: 'password123',
      });

      expect(response.status).toBe(400);
    });

    it('debería validar que la contraseña sea requerida', async () => {
      const response = await request(app).post('/api/login').send({
        email: 'juan@example.com',
      });

      expect(response.status).toBe(400);
    });
  });
});
