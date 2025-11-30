import {Schema, model} from 'mongoose';

const inscripcionSchema = new Schema({
    cursoId : {
        type : Schema.Types.ObjectId,
        ref : 'Curso',
        required : true
    },
    usuarioId : {
        type : Schema.Types.ObjectId,
        ref : 'Usuario',
        required : true
    },
    fechaInscripcion : {
        type : Date,
        default : Date.now
    },
    estadoInscripcion : {
        type : String,
        enum : ["EN_PROCESO", "ABANDONADA", "TERMINADA"],
        default : 'EN_PROCESO'
    }
});
inscripcionSchema.index({ cursoId: 1, usuarioId: 1 }, { unique: true });

export default model('Inscripcion', inscripcionSchema);