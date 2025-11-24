import { Estudiante } from "./estudiante";
import { Docente } from "./docente";
import { Administrador } from "./administrador";

export class Usuario{
    constructor(
        protected id: number,
        protected nombre: string,
        protected apellido: string,
        protected email: string,
        protected password: string,
        protected rol: string,
        protected conectado: boolean
    ){}
   
    public getId(): number {
        return this.id;
    }
    public setId(id:number): void {
        this.id = id;
    }

    public getNombre(): string {
        return this.nombre;
    }
    public setNombre(nombre:string): void {
        this.nombre = nombre;
    }

    public getApellido(): string {
        return this.apellido;
    }
    public setApellido(apellido:string): void {
        this.apellido = apellido;
    }

    public getEmail(): string {
        return this.email;
    }
    public setEmail(email:string): void {
        this.email = email;
    }

    public getPassword(): string {
        return this.password;
    }
    public setPassword(password:string): void {
        this.password = password;
    }

    public getRol(): string {
        return this.rol;
    }
    public setRol(rol:string): void {
        this.rol = rol;
    }
    public isConectado(): boolean {
        return this.conectado;
    }

   public static crearUsuario(tipo: string, props: any): Usuario{
        switch (tipo) {
            case "estudiante":
                return new Estudiante(props.id, props.nombre, props.apellido, props.email, props.password, props.legajo);
            case "docente":
                return new Docente(props.id, props.nombre, props.apellido, props.email, props.password, props.especialidad);
            case "administrador":
                return new Administrador(props.id, props.nombre, props.apellido, props.email, props.password);
            default:
                throw new Error("Tipo de usuario no válido: ${tipo}");
        }
    }

   public login(email?: string, password?: string): boolean {
        if (email && password) {
            if (email === this.email && password === this.password) {
                this.conectado = true;
                console.log(`Usuario ${this.nombre} ha iniciado sesión correctamente.`);
                return true;
            } else {
                console.warn("Credenciales incorrectas.");
                return false;
            }
        }
        this.conectado = true;
        console.log(`Usuario ${this.nombre} ha iniciado sesión.`);
        return true;
    }

    public logout(): boolean {
        if (this.conectado) {
            this.conectado = false;
            console.log(`Usuario ${this.nombre} ha cerrado sesión.`);
            return true;
        } else {
            console.warn("El usuario ya está desconectado.");
            return false;
        }
    }
}