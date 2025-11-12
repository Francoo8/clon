import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Conexión a la base de datos Railway
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

// 🔄 Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error("❌ Error conectando a la base de datos:", err.message);
  } else {
    console.log("✅ Conectado a la base de datos en Railway");
  }
});

// 🔹 Endpoint: Registro
app.post("/api/register", (req, res) => {
  const { nombre, email, password } = req.body;

  console.log("📥 Datos recibidos para registro:", { nombre, email });

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const hashed = bcrypt.hashSync(password, 10);

  const sql = "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)";

  db.query(sql, [nombre, email, hashed], (err, results) => {
    if (err) {
      console.error("❌ Error al registrar:", err);

      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "El email ya está registrado" });
      }

      return res.status(500).json({ error: "Error al registrar usuario" });
    }
    
    console.log("✅ Usuario registrado con ID:", results.insertId);
    res.json({ message: "✅ Usuario registrado correctamente" });
  });
});

// 🔹 Endpoint: Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Faltan campos" });
  }

  const sql = "SELECT * FROM usuarios WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("❌ Error en login:", err);
      return res.status(500).json({ error: "Error de servidor" });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const user = results[0];
    const valid = bcrypt.compareSync(password, user.password);
    
    if (!valid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "2h" }
    );

    res.json({ 
      message: "✅ Login exitoso", 
      token,
      email: user.email 
    });
  });
});

// 📦 Obtener todas las promociones
app.get("/api/promociones", (req, res) => {
  db.query("SELECT * FROM promociones", (err, results) => {
    if (err) {
      console.error("❌ Error al obtener promociones:", err);
      return res.status(500).json({ error: "Error al obtener promociones" });
    }
    res.json(results);
  });
});

// 🔹 Endpoint de prueba
app.get("/", (req, res) => res.send("Servidor funcionando 🚀"));

// 🟢 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🟢 Servidor iniciado en puerto ${PORT}`));