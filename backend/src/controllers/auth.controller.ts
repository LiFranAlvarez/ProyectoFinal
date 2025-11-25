import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};
