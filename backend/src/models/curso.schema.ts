import mongoose from "mongoose";
const { Schema, model} = mongoose;

const cursoSchema = new Schema({
    titulo : {
        type : String,
        unique : true,
        required : [ true, 'El titulo del curso es un campo obligatorio'],
        trim : true
    },
    descripcion : { type: String, required: true },
    estado : {
        type : String,
        enum : ['COMPLETADO' , 'EN CURSO' , 'PENDIENTE', 'CANCELADO'],
        default : 'PENDIENTE'
    },
    profesor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    clases: [{
        type: Schema.Types.ObjectId,
        ref: 'Clase'
    }],
    materiales: [{
        type: Schema.Types.ObjectId,
        ref: 'Material'
    }],
    categorias: {
        type: [String],
        default: []
    }
});


export default model('Curso', cursoSchema);