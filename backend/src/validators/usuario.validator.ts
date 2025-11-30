import { z } from "zod";

export const createUsuarioSchema = z.object({
  nombre: z.string().min(2, 'Nombre muy corto'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Password debe tener al menos 6 caracteres'),
  rol: z.string().optional(),
});

export type CreateUsuarioDto = z.infer<typeof createUsuarioSchema>;

export default { createUsuarioSchema };
