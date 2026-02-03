import { createUsuarioSchema, CreateUsuarioDto } from '../../src/validators/usuario.validator';

describe('Usuario Validator', () => {
  describe('createUsuarioSchema', () => {
    it('debería validar correctamente un usuario válido', () => {
      const validUser = {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
        rol: 'ALUMNO',
      };

      const result = createUsuarioSchema.safeParse(validUser);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validUser);
      }
    });

    it('debería rechazar un nombre muy corto', () => {
      const invalidUser = {
        nombre: 'A',
        email: 'juan@example.com',
        password: 'password123',
      };

      const result = createUsuarioSchema.safeParse(invalidUser);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Nombre muy corto');
      }
    });

    it('debería rechazar un email inválido', () => {
      const invalidUser = {
        nombre: 'Juan Pérez',
        email: 'not-an-email',
        password: 'password123',
      };

      const result = createUsuarioSchema.safeParse(invalidUser);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email inválido');
      }
    });

    it('debería rechazar una contraseña muy corta', () => {
      const invalidUser = {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'pass',
      };

      const result = createUsuarioSchema.safeParse(invalidUser);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Password debe tener al menos 6 caracteres'
        );
      }
    });

    it('debería permitir rol opcional', () => {
      const validUser = {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
      };

      const result = createUsuarioSchema.safeParse(validUser);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.rol).toBeUndefined();
      }
    });

    it('debería rechazar usuarios sin campos requeridos', () => {
      const incompleteUser = {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
      };

      const result = createUsuarioSchema.safeParse(incompleteUser);

      expect(result.success).toBe(false);
    });

    it('debería validar múltiples errores simultáneamente', () => {
      const invalidUser = {
        nombre: 'J',
        email: 'invalid-email',
        password: 'short',
      };

      const result = createUsuarioSchema.safeParse(invalidUser);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });
});
