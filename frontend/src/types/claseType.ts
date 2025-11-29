export type Clase = {
  _id: string;
  titulo: string;
  fecha: Date;
  estado?: "DISPONIBLE" | "PENDIENTE";
  linkGrabacion?:string;
};
