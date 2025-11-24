import { Request, Response, NextFunction } from "express";

const API_KEY = "MI_API_KEY_SECRETA_12345";

export function apiKeyMiddleware(req: Request, res: Response, next: NextFunction) {
  const key = req.headers["x-api-key"];
  if (key === API_KEY) {
    console.log("API key válida");
    next();
  } else {
    return res.status(401).json({ mensaje: "API Key inválida o ausente" });
  }
}
