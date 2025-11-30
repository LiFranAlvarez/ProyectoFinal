import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import config from '../config/config';
import Usuario from '../models/usuario.schema';
import CursosService from '../services/curso.service';

interface JwtPayload {
    id: string;
    rol : string;
}

export const verifyToken = async ( req : Request, res: Response, next: NextFunction ) => {
    try {
        const authHeader = (req.header('authorization') || req.header('Authorization') || req.header('token')) as string | undefined;
        const token = authHeader ? authHeader.replace(/Bearer\s?/i, '') : undefined;
        if (!token) {
            return res.status(401).json({msg : 'No se proporciono token'})
        }
        const decoded = jwt.verify(token, config.SECRET) as JwtPayload;
        const idUser = decoded.id;
        const user = await Usuario.findById(idUser, {passwordHass : 0});
        if (!user) {
            return res.status(404).json({message : 'User not found'})
        }
        (req as any).user = { id: idUser, rol: decoded.rol };
        console.log('Token verificado');
        next();
    } catch (error) {
        console.error("Error al verificar token:", error);
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
}

export const isAdmin = async ( req : Request, res: Response, next: NextFunction ) => {
    try {
        const user = (req as any).user;
        if (!user) {
            return res.status(401).json({ msg: "No autenticado" });
        }
        if (user.rol !== 'ADMIN') {
            return res.status(403).json({ message: 'Requiere rol de administrador' });
        }
        next();
    } catch (error) {
        console.error("Error en isAdmin:", error);
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
}

export const isProfesor = async ( req : Request, res: Response, next: NextFunction ) => {
    try {
        const user = (req as any).user;
        if (!user) {
            return res.status(401).json({ msg: "No autenticado" });
        }
        if (user.rol !== 'PROFESOR') {
            return res.status(403).json({ message: 'Requiere rol de profesor' });
        }
        next();
    } catch (error) {
        console.error("Error en isProfesor:", error);
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
}

export const isAdminOrProfesor = ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const user = (req as any).user;
        if (!user) return res.status(401).json({ msg: 'No autenticado' });
        if (user.rol === 'ADMIN' || user.rol === 'PROFESOR') return next();
        return res.status(403).json({ message: 'Requiere rol ADMIN o PROFESOR' });
    } catch (error) {
        console.error('isAdminOrProfesor error', error);
        return res.status(500).json({ message: 'Error interno' });
    }
}

export const canEditCurso = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const user = (req as any).user;
        if (!user) return res.status(401).json({ msg: 'No autenticado' });
        if (user.rol === 'ADMIN') return next();
        const idCurso = req.params.idCurso || req.params.id;
        if (!idCurso) return res.status(400).json({ message: 'ID de curso requerido' });
        const curso = await CursosService.getById(idCurso);
        if (!curso) return res.status(404).json({ message: 'Curso no encontrado' });
        const profesorId = String(curso.profesor?._id || curso.profesor);
        if (profesorId === String(user.id)) return next();
        return res.status(403).json({ message: 'No está autorizado para editar este curso' });
    } catch (error) {
        console.error('canEditCurso error', error);
        return res.status(500).json({ message: 'Error interno' });
    }
}
