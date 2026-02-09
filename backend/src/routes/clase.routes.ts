import { Router } from "express";
import {getClases,getClaseById,createClase,updateClase,deleteClase,} from "../controllers/clase.controller";

const router = Router();

router.get("/", getClases);
router.get("/:id", getClaseById);
router.post("/", createClase);
router.put("/:id", updateClase);
router.delete("/:id", deleteClase);

export default router;