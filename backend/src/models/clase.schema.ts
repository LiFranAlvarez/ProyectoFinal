import mongoose from "mongoose";
const { Schema, model } = mongoose;

const claseSchema = new Schema({
  titulo: { type: String, required: true },
  fecha: {type: Date, default: Date.now },
  estado:{type:String, default:"PENDIENTE"},
  linkGrabacion:{type:String}
});

export default model("Clase", claseSchema);
