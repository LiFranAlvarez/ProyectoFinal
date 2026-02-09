import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import Database from './config/db.connect.js';
import userRouter from './routes/usuario.route.js';
import cursoRouter from './routes/curso.routes.js';
import inscripcionRouter from './routes/inscripciones.route.js';
import authRouter from './routes/auth.route.js';
import errorHandler from './middlewares/errorHandler.js';
import claseRoutes from './routes/clase.routes.js';
import materialRoutes from './routes/material.routes.js';
import reportesRoutes from './routes/reportes.routes.js';
import { verifyApiKey } from './middlewares/authToken.js';

class Server {
    public app: express.Application;
    public port: number;

    constructor(port: number) {
        this.port = port;
        this.app = express();
        this.middlewares();
        this.routes();
    }

    middlewares(){


        // Logger HTTP
        this.app.use(morgan('dev'));
        // Log simple request info for debugging
        this.app.use((req, _res, next) => {
            console.log('REQ:', req.method, req.originalUrl);
            next();
        });
        //cors
        this.app.use( cors({
            origin: true, 
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']}
        ));
        this.app.use(express.json({limit: '150mb'}));        
        //this.app.use(verifyApiKey)
    }
    routes(){
        
        this.app.use("/api/clases", claseRoutes);
        this.app.use("/api/materiales", materialRoutes);
        this.app.use('/api', userRouter);
        this.app.use('/api/cursos', cursoRouter);
        this.app.use('/api', inscripcionRouter);
        this.app.use('/api', authRouter);
        this.app.use('/api/reportes', reportesRoutes);
        this.app.use(errorHandler);

    }
    async start(callback: () => void) {
        await Database.getInstance();
        this.app.listen(this.port, callback);
    }
}
export default Server;