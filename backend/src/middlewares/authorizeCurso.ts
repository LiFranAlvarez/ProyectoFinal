import { Request, Response, NextFunction } from 'express';

import { cursosService } from '../services';

/**
 *
 * Reglas:
 *  - ADMIN puede editar cualquier curso
 *  - PROFESOR solo su propio curso
 *
 */
export const authorizeCursoEdit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    if (req.user.rol === 'ADMIN') {
      return next();
    }

    const idCurso = req.params.idCurso || req.params.id;
    if (!idCurso) {
      return res.status(400).json({ message: 'ID de curso requerido' });
    }

    const curso = await cursosService.getById(idCurso);
    if (!curso) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }

    const profesorId = String(curso.profesor?._id || curso.profesor);
    if (profesorId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    next();
  } catch {
    return res.status(500).json({ message: 'Error interno' });
  }
};
