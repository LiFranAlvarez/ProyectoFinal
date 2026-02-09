import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
import CursosService from "../services/curso.service";

interface JwtPayload {
  id: string;
  rol: string;
}

export const verifyApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header("x-api-key");
  if (!apiKey || apiKey !== config.API_KEY) {
    return res.status(403).json({ message: "API key inválida o no proporcionada" });
  }
  next();
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader?.replace(/Bearer\s?/i, "");
    if (!token) return res.status(401).json({ message: "No se proporcionó token" });

    const decoded = jwt.verify(token, config.SECRET as string) as unknown as JwtPayload;
    (req as any).user = { id: decoded.id, rol: decoded.rol };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

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

export const refreshTokenController = (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "No hay refresh token" });

  try {
    const payload = jwt.verify(refreshToken, config.REFRESH_SECRET) as any;
    const newAccessToken = jwt.sign(
      { id: payload.id },
      config.SECRET,
      { expiresIn: "1h" }
    );
    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: "Refresh token inválido o expirado" });
  }
};