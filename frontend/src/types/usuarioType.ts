export type Usuario = {
  _id: string;
  nombre: string;
  password?:string;
  email: string;
  rol: "ALUMNO" | "PROFESOR" | "ADMIN";
  conectado?:boolean;
};