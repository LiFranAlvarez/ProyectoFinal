import { Request, Response } from "express";

export class AdminController {
  static getDashboard(req: Request, res: Response): void {
    res.status(200).json({
      message: "Panel de administración del sistema E-learning (demo)",
      stats: {
        usuarios: 10,
        cursos: 5,
        docentes: 3,
        estudiantes: 7,
      },
    });
  }

  static manageUsers(req: Request, res: Response): void {
    res.status(200).json({ message: "Gestión de usuarios (demo)" });
  }

  static manageCourses(req: Request, res: Response): void {
    res.status(200).json({ message: "Gestión de cursos (demo)" });
  }
}
