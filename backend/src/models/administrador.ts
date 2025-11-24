import { Usuario } from "./usuario";
import { Curso } from "./curso.js";

export class Administrador extends Usuario {
    constructor(
        id: number,
        nombre: string,
        apellido: string,
        email: string,
        password: string,
        rol: string = "administrador",
        conectado: boolean = false,
        protected permisos: string[] = []
    ) {
        super(id, nombre, apellido, email, password, rol, conectado);
    }

    public crearUsuario(usuario: Usuario): void {
        console.log(`El administrador ${this.nombre} creó al usuario: ${usuario.getNombre()}`);
    }

    public eliminarUsuario(usuario: Usuario): void {
        console.log(`El administrador ${this.nombre} eliminó al usuario: ${usuario.getNombre()}`);
    }

    public asignarRol(usuario: Usuario, nuevoRol: string): void {
        usuario.setRol(nuevoRol);
        console.log(`Se asignó el rol "${nuevoRol}" al usuario ${usuario.getNombre()}`);
    }

    public generarReporte(tipo: string): void {
        console.log(`El administrador ${this.nombre} generó un reporte de tipo: ${tipo}`);
    }

    public gestionarCurso(curso: Curso, activo: boolean): void {
        console.log(`El curso "${curso.getTitulo()}" fue ${activo ? 'activado' : 'desactivado'} por ${this.nombre}`);
    }
}
