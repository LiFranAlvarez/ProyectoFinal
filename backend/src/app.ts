// import express from 'express';
// import cors from 'cors';
// import morgan from 'morgan';
// import Database from './config/db.connect.js';


// class Server {
//     public app: express.Application;
//     public port: number;

//     constructor(port: number) {
//         this.port = port;
//         this.app = express();
//         this.middlewares();
//         this.routes();
//     }

//     middlewares(){
//         this.app.use(express.json({limit: '150mb'}));

//         // Logger HTTP
//         this.app.use(morgan('dev'));
//         //cors
//         this.app.use( cors());
//     }
//     routes(){
//         // this.app.use("/users",userRoute);
//         // this.app.use( "/categories",categoryRoute);
//         // this.app.use("/products",productRouote)
//         // this.app.use("/restart",restartRoute);

//     }
//     async start(callback: () => void) {
//         await Database.getInstance();
//         this.app.listen(this.port, callback);
//     }
// }
// export default Server;


import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { loggerMiddleware } from "./middlewares/loggerMiddleware.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// Rutas
import usuarioRoutes from "./routes/usuario.routes.js";
import cursoRoutes from "./routes/curso.routes.js";
import estudianteRoutes from "./routes/estudiante.routes.js";
import docenteRoutes from "./routes/docente.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();
const PORT = 3000;

// Middlewares globales
app.use(cors());
app.use(bodyParser.json());
app.use(loggerMiddleware);

// Rutas principales
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/cursos", cursoRoutes);
app.use("/api/estudiantes", estudianteRoutes);
app.use("/api/docentes", docenteRoutes);
app.use("/api/admin", adminRoutes);

// Middleware global de manejo de errores
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

