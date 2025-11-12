import express from "express";
import cors from "cors";
import mysql from "mysql2/promise"; 
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
  port: process.env.DB_PORT, // 🔹 asegúrate de que esté separado del host
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // 🔹 Railway usa SSL, pero no requiere validación estricta
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

  if (!nombre || !email || !password)
    return res.status(400).json({ error: "Faltan campos obligatorios" });

  const hashed = bcrypt.hashSync(password, 10);

  console.log("Datos a insertar:", { nombre, email, password: hashed }); // <--- para depuración

  const sql = "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)";

  db.query(sql, [nombre, email, hashed], (err) => {
    if (err) {
      console.error("❌ Error al registrar:", err);

      // Manejar email duplicado
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "El email ya está registrado" });
      }

      return res.status(500).json({ error: "Error al registrar usuario" });
    }
    res.json({ message: "✅ Usuario registrado correctamente" });
  });
});

// 🔹 Endpoint: Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Faltan campos" });

  const sql = "SELECT * FROM usuarios WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Error de servidor" });
    if (results.length === 0)
      return res.status(401).json({ error: "Usuario no encontrado" });

    const user = results[0];
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid)
      return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ message: "✅ Login exitoso", token });
  });
});

// 🧠 Middleware para verificar si es admin
function verificarAdmin(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No autorizado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email !== "admin@gmail.com") {
      return res.status(403).json({ error: "Acceso denegado" });
    }
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
  }
}

// 📦 Obtener todas las promociones
app.get("/api/promociones", (req, res) => {
  db.query("SELECT * FROM promociones", (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener promociones" });
    res.json(results);
  });
});

// ➕ Crear una promoción (solo admin)
app.post("/api/promociones", verificarAdmin, (req, res) => {
  const { titulo, descripcion, imagen_url, precio } = req.body;
  db.query(
    "INSERT INTO promociones (titulo, descripcion, imagen_url, precio) VALUES (?, ?, ?, ?)",
    [titulo, descripcion, imagen_url, precio],
    (err) => {
      if (err) return res.status(500).json({ error: "Error al crear promoción" });
      res.json({ message: "Promoción creada correctamente ✅" });
    }
  );
});

// ✏️ Editar promoción (solo admin)
app.put("/api/promociones/:id", verificarAdmin, (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, imagen_url, precio } = req.body;
  db.query(
    "UPDATE promociones SET titulo=?, descripcion=?, imagen_url=?, precio=? WHERE id=?",
    [titulo, descripcion, imagen_url, precio, id],
    (err) => {
      if (err) return res.status(500).json({ error: "Error al actualizar promoción" });
      res.json({ message: "Promoción actualizada ✅" });
    }
  );
});

// ❌ Eliminar promoción (solo admin)
app.delete("/api/promociones/:id", verificarAdmin, (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM promociones WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Error al eliminar promoción" });
    res.json({ message: "Promoción eliminada ✅" });
  });
});


// 🔹 Endpoint de prueba
app.get("/", (req, res) => res.send("Servidor funcionando 🚀"));

// 🟢 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🟢 Servidor iniciado en el puerto ${PORT}`));
