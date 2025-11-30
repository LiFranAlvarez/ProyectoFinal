import { Request, Response } from 'express';
import HttpError from '../utils/httpError';
import signInService from '../services/auth.service';
import Jwt from 'jsonwebtoken';
import  config  from '../config/config';

async function  signInController( req : Request, res: Response ) {
    try {
        const { email, password} = req.body;
        console.log('SIGNIN request body:', { email });
        const result = await signInService(email, password);
        console.log('SIGNIN service result:', result);

        if (!result) {
            return res.status(401).json({message: 'No se pudo Iniciar Sesion'});
        }

        const token = Jwt.sign({_id : result.id, nombre: result.nombre, email: result.email, rol: result.rol}, config.SECRET,
            { expiresIn : 3600}) //1HS

            res.status(200).json({message: 'Inicio Sesion Correctamente', token : token});
    } catch (error) {
        if (error instanceof HttpError) {
            return res.status(error.status).json({message : error.message})
        }
        console.error(error);
        res.status(400).json(error);
    }
}

export default signInController;