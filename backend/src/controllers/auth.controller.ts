import { Request, Response } from 'express';
import HttpError from '../utils/httpError';
import signInService from '../services/auth.service';
import Jwt from 'jsonwebtoken';
import config from '../config/config';

export async function signInController(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const result = await signInService(email, password);
        
        if (!result) {
            return res.status(401).json({ message: 'No se pudo Iniciar Sesion' });
        }

        // Token de acceso (1 hora)
        const accessToken = Jwt.sign(
            { id: result.id, rol: result.rol },
            config.SECRET,
            { expiresIn: "1h" }
        );

        // Refresh Token (7 días) - ¡AHORA INCLUYE EL ROL!
        const refreshToken = Jwt.sign(
            { id: result.id, rol: result.rol }, 
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
            return res.status(error.status).json({ message: error.message });
        }
        res.status(400).json(error);
    }
}

export const refreshTokenController = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ message: "Refresh Token requerido" });

    try {
        const decoded = Jwt.verify(refreshToken, config.REFRESH_SECRET) as any;

        // Generamos nuevo Access Token usando el rol que viene en el refresh
        const newAccessToken = Jwt.sign(
            { id: decoded.id, rol: decoded.rol }, 
            config.SECRET, 
            { expiresIn: "1h" }
        );

        return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        return res.status(403).json({ message: "Refresh Token inválido o expirado" });
    }
};