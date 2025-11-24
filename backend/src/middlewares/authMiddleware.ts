import { Request, Response, NextFunction } from "express";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ mensaje: "Acceso denegado: falta token" });
  }

  
  if (token === "Bearer acceso-valido") {
    console.log("✅ Token verificado");
    next();
  } else {
    return res.status(403).json({ mensaje: "Token inválido o expirado" });
  }
}
