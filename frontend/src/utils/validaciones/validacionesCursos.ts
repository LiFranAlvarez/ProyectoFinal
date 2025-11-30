
import { z } from 'zod';

export const cursoSchema = z.object({
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  categoria: z.string().min(1, 'Seleccioná una categoría'),
});