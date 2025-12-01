import mongoose from "mongoose";
const { Schema, model } = mongoose;

const usuarioSchema = new Schema({
    nombre : String,
    email : {
        type : String,
        unique : true
    },
    passwordHass : String,
    rol : {
        type : String,
        enum : ['ADMIN' , 'PROFESOR' , 'ALUMNO'],
        default: "ALUMNO"
    },

});

export default model('Usuario', usuarioSchema);