import express from 'express';
import { UsuarioController } from "../controllers/usuario.controller.js";
import { Usuario} from '../models/usuario';
import { validateRole } from "../middlewares/validateRole.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, UsuarioController.getAll);
router.get("/:id", authMiddleware, UsuarioController.getById);
router.post("/", UsuarioController.create);
router.put("/:id", validateRole(["admin"]), UsuarioController.update);
router.delete("/:id", validateRole(["admin"]), UsuarioController.delete);

let usuarios: Usuario[] = [];

router.get("/privado", authMiddleware, (req, res) => {
  res.json({ mensaje: "Ruta privada accesible" });
});

router.get('/', (req, res) => {
  res.json(usuarios);
});

router.post('/', (req, res) => {
    const {id, nombre, apellido, email, password, rol} = req.body;
    const nuevoUsuario = new Usuario(id, nombre, apellido, email, password, rol, false);
    usuarios.push(nuevoUsuario);
    res.status(201).json({mensaje: "Usuario creado correctamente", usuario: nuevoUsuario});
});

router.post('/login', (req, res) => {
    const {email, password} = req.body;
    const usuario = usuarios.find(u => u.getEmail() === email);
    
    if (!usuario) return res.status(404).json({mensaje: "Usuario no encontrado"});

    if (usuario.login(email, password)) {
        res.json({mensaje: "Inicio de sesión exitoso", usuario});
    } else {
        res.status(401).json({mensaje: "Credenciales incorrectas"});
    }
});
export default router;