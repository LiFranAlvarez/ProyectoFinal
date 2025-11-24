import { Request, Response, NextFunction } from "express";

export function validateRole(rolesPermitidos: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const rol = req.headers["x-user-role"];

    if (!rol || !rolesPermitidos.includes(String(rol))) {
      return res.status(403).json({ mensaje: "No tienes permisos para esta acción" });
    }

    console.log(`🔐 Acceso permitido al rol: ${rol}`);
    next();
  };
}
