import mongoose from "mongoose";
const { Schema, model } = mongoose;

const materialSchema = new Schema({
  titulo: String,
  tipo: String,
  enlace: String,
  fechaSubida: { type: Date, default: Date.now }
});

export default model("Material", materialSchema);

