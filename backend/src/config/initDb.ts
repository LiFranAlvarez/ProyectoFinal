import db from "./database";

export const initDb = () => {
  db.serialize(() => {
    db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    rol TEXT NOT NULL,
    conectado INTEGER DEFAULT 0
  )
`);

    console.log("✅ Tablas verificadas/creadas");
  });
};
