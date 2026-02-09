import Usuario from '../models/usuario.schema'
import HttpError from '../utils/httpError';
import { Types } from "mongoose";
import bcryptjs from 'bcryptjs';

type RolUsuario = 'ADMIN' | 'PROFESOR' | 'ALUMNO';
interface IUser {
    _id?: Types.ObjectId;
    nombre: string;
    dni?: string;
    email: string;
    passwordHass?: string; 
    rol?: RolUsuario; 
};

class UserService{
    async createOneUser( data: IUser){
        try {
            const newUser = await Usuario.create(data);
            console.log('USUARIO CREADO');
            return newUser;
        } catch (error) {
            throw new HttpError('No se pudo crear un usuario', 500);
        }
    };

    async getOneUser( idUser: string ){
        try {
            return await Usuario.findById(idUser);
        } catch (error) {
            throw new HttpError('Error al buscar User por ID', 500);
        }
    };

    async updateOneUser( idUser: string, data: IUser){
        try {
            const result = await Usuario.findByIdAndUpdate(idUser, data, {
                    new : true,
                    runValidators : true
                    });
                    console.log('USUARIO ACTUALIZADO');
            return result;
        } catch (error) {
            throw new HttpError("No se pudo buscar y eliminar User", 500);
        }
    };

    async deleteOneUser( idUser: string){
        try {
            const deleted = await Usuario.findByIdAndDelete(idUser);
            console.log('USUARIO ELIMINADO');
            return deleted;
        } catch (error) {
                throw new HttpError("No se pudo eliminar service.DeleteOne", 500);
        }
    };

    async getById( idUser: string){
        try {
            return await Usuario.findById(idUser);
        } catch (error) {
            throw new HttpError("No se encontro usuario con ese id", 500);
        }
    };
    async getAllUsers(){
        try {
            return await Usuario.find();
        } catch (error) {
            throw new HttpError('Error buscando usuarios', 500);
        }
    }
};
export default new UserService();