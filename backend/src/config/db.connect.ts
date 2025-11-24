import 'mongoose';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const mongoUrl = process.env.MONGO_URL;

export default class Database {
    private static instancia : Database | null = null;
    private constructor() {
        if (!mongoUrl) {
            throw new Error("No se encontro URL para la base de datos");
        }
    }
    private async connectDb (){
        try {
                if (!mongoUrl) {
                    throw new Error("No se encontro variable de entorno MONGO_URL");
                }
                await mongoose.connect(mongoUrl);
                console.log('DB on port ');
            } catch (error) {
                console.error('Error al conectar a DB', error);
                process.exit(1);
            }
    }
    public static async getInstance(){
        if (Database.instancia == null) {
            Database.instancia = new Database();
            await Database.instancia.connectDb();
        }
        return Database.instancia;
    }
}