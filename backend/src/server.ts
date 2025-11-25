import express, { Application} from 'express';
import cors from 'cors';
import { logger } from "./middlewares/logger.middleware";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { notFound } from "./middlewares/notFound.middleware";
import { initDb } from "./config/initDb";
import usuarioRoutes from "./routes/usuario.route";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";


dotenv.config();

export const createServer = (): Application => {
    const app = express();

    // Inicializar la base de datos al iniciar el servidor
    initDb();
  

  // Middlewares esenciales
  app.use(cors());
  app.use(express.json());
  app.use(logger);
  app.use("/usuarios", usuarioRoutes);
  app.use("/auth", authRoutes);

  // Middleware de 404
  app.use(notFound);

  // Middleware global de errores
  app.use(errorHandler);

  // Ruta base de prueba

  app.get("/ping", (_req, res) => {
    res.status(200).json({ message: "pong" });
  });

  // Aquí luego se importarán rutas:
  // app.use("/usuarios", usuarioRoutes);
  // app.use("/cursos", cursoRoutes);
  // app.use("/auth", authRoutes);

  return app;
};



export const startServer = () => {
  const app = createServer();
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
  });


}