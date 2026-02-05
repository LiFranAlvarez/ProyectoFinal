import { Request, Response, NextFunction } from 'express';
import { cursosService } from '../services';
import { CursoFactory } from '../factories/cursoFactory';
import { Types } from 'mongoose';

export const crearCurso = async (req: Request, res: Response, next: NextFunction) => {
  try {
  const dto = CursoFactory.fromRequest(req.body);

  const curso = await cursosService.createOne({
    ...dto,
    descripcion: dto.descripcion ?? '',
    profesor: Types.ObjectId.createFromHexString(req.user!.id),
  });

  res.status(201).json({ success: true, data: curso });
} catch (err) {
  next(err);
}
};

export const listCursos = async (_req: Request, res: Response, next: NextFunction) => {
  try {
  const cursos = await cursosService.getAll();
  res.status(200).json({ success: true, data: cursos });
} catch (err) {
  next(err);
}
};

export const getCursosByProfesor = async (req: Request, res: Response, next: NextFunction) => {
  try {
  const cursos = await cursosService.getByProfesor(req.user!.id);
  res.status(200).json({ success: true, data: cursos });
} catch (err) {
  next(err);
}
};

export const updateCurso = async (req: Request, res: Response, next: NextFunction) => {
  try {
  const dto = CursoFactory.fromRequest(req.body);

  const curso = await cursosService.updateOne(req.params.id, {
    ...dto,
    descripcion: dto.descripcion ?? '',
    profesor: Types.ObjectId.createFromHexString(req.user!.id),
  });

  res.status(200).json({ success: true, data: curso });
} catch (err) {
  next(err);
}
};

export const deleteCurso = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await cursosService.deleteOne(req.params.id);
    res.status(200).json({ success: true, message: 'Curso eliminado' });
  } catch (err) {
    next(err);
  }
};

export const getCursoById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const curso = await cursosService.getById(req.params.id);
    res.status(200).json({ success: true, data: curso });
  } catch (err) {
    next(err);
  }
};
