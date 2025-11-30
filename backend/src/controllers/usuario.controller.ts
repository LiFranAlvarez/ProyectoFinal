import UserService from '../services/user.service';
import { Request, Response } from 'express';
import bcrypt  from 'bcryptjs';
import jwt from 'jsonwebtoken';
import HttpError from '../utils/httpError';



class UserController{
    async createUser(req : Request, res: Response){
        try {
            const { nombre, email, password, rol } = req.body;
            const finalRol = rol || 'ALUMNO';
            if (typeof nombre !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
                throw new Error("Los campos al crear un usuario deben ser string");
            }
            const passwordHass = bcrypt.hashSync(password, 10);
            const result = await UserService.createOneUser({ nombre, email, passwordHass, rol: finalRol });
            if (result === null) {
                return res.status(200).json({ message : 'No se pudo crear el Usuario'});
            }
            res.status(201).json(result);
        } catch (error) {
            if (error instanceof HttpError) {
                return res.status(error.status).json({message : error.message})
            }
            console.error(error);
            res.status(400).json(error);
        }
    
    };
    async getUsers(req:Request,res:Response){
        try {
            const result = await UserService.getAllUsers();
            if (!result || result.length === 0) {
                return res.status(200).json({ message: 'No hay usuarios cargados' });
            }
            const sanitized = result.map((u: any) => {
                const obj = u.toObject ? u.toObject() : { ...u };
                delete obj.passwordHass;
                return obj;
            });
            res.status(200).json(sanitized);
        } catch (error) {
            if (error instanceof HttpError) {
                return res.status(error.status).json({message : error.message})
            }
            console.error(error);
            res.status(400).json(error);
        }
    };


    async getUserById(req : Request, res: Response){
        try {
            const result = await UserService.getOneUser(req.params.id);
            if (result === null) {
                return res.status(200).json({ message : 'No se encontro user con id: ' + req.params.id});
            }
            res.status(201).json(result);
        } catch (error) {
            if (error instanceof HttpError) {
                return res.status(error.status).json({message : error.message})
            }
            console.error(error);
            res.status(400).json(error);
        }
    };
    async UpdateUserById(req : Request, res: Response){
        try {
            const {nombre, email} = req.body;
            if (typeof nombre !== 'string' || typeof email !== 'string' ) {
                throw new Error("Para editar un user los campos tienen que ser un string");
            }
            const id = req.params.id;
            const result = await UserService.updateOneUser(id, {nombre, email});
            if (result === null) {
                return res.status(200).json({ message : 'No se pudo actualizar el Usuario'});
            }
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof HttpError) {
                return res.status(error.status).json({message : error.message})
            }
            console.error(error);
            res.status(400).json(error);
        }
    };
    async deleteUserbyId(req : Request, res: Response){
        try {
            const result = await UserService.deleteOneUser(req.params.id);
            if (result === null) {
                return res.status(200).json({ message : 'No se pudo eliminar el Usuario'});
            }
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof HttpError) {
                return res.status(error.status).json({message : error.message})
            }
            console.error(error);
            res.status(400).json(error);
        }
    };
    
};

export default new UserController();