import { CursoMongoRepository } from '../repositories/CursoMongoRepository';

import { CursosService } from './curso.service';

const cursoRepository = new CursoMongoRepository();
export const cursosService = new CursosService(cursoRepository);
