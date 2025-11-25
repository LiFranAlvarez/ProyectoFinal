import { login } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.post("/login", login);

/** Ruta protegida */
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Perfil del usuario autenticado",
    user: req.user
  });
});

export default router;