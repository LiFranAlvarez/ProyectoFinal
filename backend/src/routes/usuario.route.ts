import { Router } from "express";
import { UsuarioController } from "../controllers/usuario.controller";

const router = Router();
const controller = new UsuarioController();

// GET /usuarios
router.get("/", controller.getAll.bind(controller));

// GET /usuarios/:id
router.get("/:id", controller.getById.bind(controller));

// POST /usuarios
router.post("/", controller.create.bind(controller));

// PUT /usuarios/:id
router.put("/:id", controller.update.bind(controller));

// DELETE /usuarios/:id
router.delete("/:id", controller.delete.bind(controller));

export default router;
