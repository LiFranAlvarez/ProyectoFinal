import { Request, Response } from 'express';
import HttpError from '../utils/httpError';
import signInService from '../services/auth.service';
import Jwt from 'jsonwebtoken';
import  config  from '../config/config';

async function  signInController( req : Request, res: Response ) {
    try {
        const { email, password} = req.body;
        const result = await signInService(email, password);
        if (!result) {
            return res.status(401).json({message: 'No se pudo Iniciar Sesion'});
        }

        const accessToken = Jwt.sign(
            { id: result.id, rol: result.rol },
            config.SECRET,
            { expiresIn: "1h" }
            );

            const refreshToken = Jwt.sign(
            { id: result.id },
            config.REFRESH_SECRET,
            { expiresIn: "7d" }
            );

            res.status(200).json({
            message: "Inicio Sesión Correctamente",
            accessToken,
            refreshToken
        });
    } catch (error) {
        if (error instanceof HttpError) {
            return res.status(error.status).json({message : error.message})
        }
        console.error(error);
        res.status(400).json(error);
    }
}

export default signInController;