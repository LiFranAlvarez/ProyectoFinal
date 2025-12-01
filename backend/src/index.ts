import Server from "./app.js";
import dotenv from 'dotenv';

dotenv.config();
const port : number = Number(process.env.PORTEXPRESS) || 3000;

const server = new Server(port);
server.start(()=>{
    console.log("express on port 3000");
    
})