import { Request, Response } from "express";
import { cursosService } from "../services";
import { CursoFactory } from "../factories/cursoFactory";
import { Types } from "mongoose";

export const crearCurso = async (req: Request, res: Response) => {
  const dto = CursoFactory.fromRequest(req.body);

  const curso = await cursosService.createOne({
    ...dto,
    descripcion: dto.descripcion ?? "",
    profesor: Types.ObjectId.createFromHexString(req.user!.id),
  });

  res.status(201).json({ success: true, data: curso });
};

export const listCursos = async (_req: Request, res: Response) => {
  const cursos = await cursosService.getAll();
  res.status(200).json({ success: true, data: cursos });
};

export const getCursosByProfesor = async (req: Request, res: Response) => {
  const cursos = await cursosService.getByProfesor(req.user!.id);
  res.status(200).json({ success: true, data: cursos });
};

export const updateCurso = async (req: Request, res: Response) => {
  const dto = CursoFactory.fromRequest(req.body);

  const curso = await cursosService.updateOne(req.params.id, {
    ...dto,
    descripcion: dto.descripcion ?? "",
    profesor: Types.ObjectId.createFromHexString(req.user!.id),
  });

  res.status(200).json({ success: true, data: curso });
};

export const deleteCurso = async (req: Request, res: Response) => {
  await cursosService.deleteOne(req.params.id);
  res.status(200).json({ success: true, message: "Curso eliminado" });
};

export const getCursoById = async (req: Request, res: Response) => {
  const curso = await cursosService.getById(req.params.id);
  res.status(200).json({ success: true, data: curso });
};