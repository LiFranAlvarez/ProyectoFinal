import { Router } from "express";
import { getMateriales, getMaterialById,createMaterial,updateMaterial,deleteMaterial,} from "../controllers/material.controller";
import { verifyApiKey } from "../middlewares/authToken";

const router = Router();

router.get("/",verifyApiKey, getMateriales);
router.get("/:id",verifyApiKey, getMaterialById);
router.post("/",verifyApiKey, createMaterial);
router.put("/:id",verifyApiKey, updateMaterial);
router.delete("/:id",verifyApiKey, deleteMaterial);

export default router;