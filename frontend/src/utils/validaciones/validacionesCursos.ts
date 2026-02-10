import { z } from "zod";

export const cursoSchema = z.object({
  titulo: z.string().min(1, "El título es obligatorio"),
  descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  categorias: z.array(z.string()).nonempty("Debe haber al menos una categoría"), 
  profesor: z.string().min(1, "Debe seleccionar un profesor"),
  estado: z.enum(["COMPLETADO", "EN CURSO", "PENDIENTE", "CANCELADO"]).optional(),
});