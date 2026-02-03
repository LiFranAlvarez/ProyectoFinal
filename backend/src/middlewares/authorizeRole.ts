import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de AUTORIZACIÓN POR ROL
 * Permite definir qué roles pueden acceder a una ruta
 *
 * Ejemplo:
 * authorizeRole('ADMIN')
 * authorizeRole('ADMIN', 'PROFESOR')
 */
export const authorizeRole =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    next();
  };
