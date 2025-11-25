import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header) return res.status(401).json({ message: "Token no proporcionado" });

  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Formato de token inválido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};
