import { z } from 'zod';

export const claseSchema = z.object({
  _id: z.string().optional(),
  titulo: z.string().min(3, "El título debe tener al menos 3 caracteres.").max(100, "El título es demasiado largo."),
  
  estado: z.enum(["PENDIENTE", "DISPONIBLE"]).default("PENDIENTE").optional(),
  fecha: z.string().optional(), 
  
  linkGrabacion: z.string().url("El link debe ser una URL válida.").optional().or(z.literal('')), 

}).strict();

export type ClaseFormType = z.infer<typeof claseSchema>;