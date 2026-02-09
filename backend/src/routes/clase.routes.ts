import { Router } from "express";
import {getClases,getClaseById,createClase,updateClase,deleteClase,} from "../controllers/clase.controller";
import { verifyApiKey } from "../middlewares/authToken";

const router = Router();

router.get("/",verifyApiKey, getClases);
router.get("/:id", verifyApiKey,getClaseById);
router.post("/", verifyApiKey,createClase);
router.put("/:id",verifyApiKey, updateClase);
router.delete("/:id",verifyApiKey, deleteClase);

export default router;