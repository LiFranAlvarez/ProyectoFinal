import sqlite3 from "sqlite3";
import path from "path";

// Ruta absoluta al archivo SQLite
const dbPath = path.resolve(__dirname, "../../database.sqlite");

// Abrir conexión
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Error al conectar con SQLite:", err.message);
  } else {
    console.log("✅ Conectado a la base de datos SQLite");
  }
});

export default db;
