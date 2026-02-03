import { CursosService, ICurso } from '../../src/services/curso.service';
import HttpError from '../../src/utils/httpError';
import { Types } from 'mongoose';

// Mock del repositorio
const mockRepository = {
  getById: jest.fn(),
  findAll: jest.fn(),
  findByProfesor: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('Cursos Service', () => {
  let cursosService: CursosService;

  beforeEach(() => {
    cursosService = new CursosService(mockRepository);
    jest.clearAllMocks();
  });

  describe('getById', () => {
    it('debería retornar un curso por ID', async () => {
      const cursoId = new Types.ObjectId().toString();
      const mockCurso = {
        _id: cursoId,
        titulo: 'TypeScript Básico',
        descripcion: 'Aprende TypeScript desde cero',
        estado: 'EN CURSO' as const,
        profesor: new Types.ObjectId(),
      };

      mockRepository.getById.mockResolvedValue(mockCurso);

      const result = await cursosService.getById(cursoId);

      expect(result).toEqual(mockCurso);
      expect(mockRepository.getById).toHaveBeenCalledWith(cursoId);
    });
  });

  describe('getAll', () => {
    it('debería retornar todos los cursos', async () => {
      const mockCursos = [
        {
          _id: new Types.ObjectId(),
          titulo: 'Curso 1',
          descripcion: 'Descripción 1',
          estado: 'EN CURSO' as const,
          profesor: new Types.ObjectId(),
        },
        {
          _id: new Types.ObjectId(),
          titulo: 'Curso 2',
          descripcion: 'Descripción 2',
          estado: 'COMPLETADO' as const,
          profesor: new Types.ObjectId(),
        },
      ];

      mockRepository.findAll.mockResolvedValue(mockCursos);

      const result = await cursosService.getAll();

      expect(result).toEqual(mockCursos);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });

    it('debería retornar array vacío si no hay cursos', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await cursosService.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('createOne', () => {
    it('debería crear un nuevo curso', async () => {
      const newCurso: ICurso = {
        titulo: 'Nuevo Curso',
        descripcion: 'Descripción del nuevo curso',
        estado: 'EN CURSO',
        profesor: new Types.ObjectId(),
      };

      const createdCurso = {
        _id: new Types.ObjectId(),
        ...newCurso,
      };

      mockRepository.create.mockResolvedValue(createdCurso);

      const result = await cursosService.createOne(newCurso);

      expect(result).toEqual(createdCurso);
      expect(mockRepository.create).toHaveBeenCalledWith(newCurso);
    });
  });

  describe('updateOne', () => {
    it('debería actualizar un curso existente', async () => {
      const cursoId = new Types.ObjectId().toString();
      const updateData: ICurso = {
        titulo: 'Curso Actualizado',
        descripcion: 'Descripción actualizada',
        estado: 'EN CURSO',
        profesor: new Types.ObjectId(),
      };

      const updatedCurso = {
        _id: cursoId,
        ...updateData,
      };

      mockRepository.update.mockResolvedValue(updatedCurso);

      const result = await cursosService.updateOne(cursoId, updateData);

      expect(result).toEqual(updatedCurso);
      expect(mockRepository.update).toHaveBeenCalledWith(cursoId, updateData);
    });

    it('debería lanzar error 404 si el curso no existe', async () => {
      const cursoId = new Types.ObjectId().toString();
      const updateData: ICurso = {
        titulo: 'Curso Actualizado',
        descripcion: 'Descripción actualizada',
        estado: 'EN CURSO',
        profesor: new Types.ObjectId(),
      };

      mockRepository.update.mockResolvedValue(null);

      await expect(cursosService.updateOne(cursoId, updateData)).rejects.toThrow(
        HttpError
      );
    });
  });

  describe('deleteOne', () => {
    it('debería eliminar un curso', async () => {
      const cursoId = new Types.ObjectId().toString();
      mockRepository.delete.mockResolvedValue(true);

      const result = await cursosService.deleteOne(cursoId);

      expect(mockRepository.delete).toHaveBeenCalledWith(cursoId);
    });
  });

  describe('getByProfesor', () => {
    it('debería retornar cursos de un profesor específico', async () => {
      const profesorId = new Types.ObjectId().toString();
      const mockCursos = [
        {
          _id: new Types.ObjectId(),
          titulo: 'Curso Profesor 1',
          descripcion: 'Descripción 1',
          estado: 'EN CURSO' as const,
          profesor: new Types.ObjectId(profesorId),
        },
      ];

      mockRepository.findByProfesor.mockResolvedValue(mockCursos);

      const result = await cursosService.getByProfesor(profesorId);

      expect(result).toEqual(mockCursos);
      expect(mockRepository.findByProfesor).toHaveBeenCalledWith(profesorId);
    });
  });
});
