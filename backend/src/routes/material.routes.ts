import { Router } from "express";
import { getMateriales, getMaterialById,createMaterial,updateMaterial,deleteMaterial,} from "../controllers/material.controller";

const router = Router();

router.get("/", getMateriales);
router.get("/:id", getMaterialById);
router.post("/", createMaterial);
router.put("/:id", updateMaterial);
router.delete("/:id", deleteMaterial);

export default router;