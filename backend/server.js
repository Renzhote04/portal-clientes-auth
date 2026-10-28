// server.js - Punto de entrada del servidor Express
const express = require('express');
const cors = require('cors');
const path = require('path');

// Importar rutas modulares
const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = 3000;

// ==========================================
// MIDDLEWARES GLOBALES
// ==========================================
app.use(cors()); // Permite peticiones locales
app.use(express.json()); // Permite recibir JSON en el cuerpo de las peticiones

// ==========================================
// ARCHIVOS ESTÁTICOS DEL FRONTEND
// ==========================================
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../frontend/html')));
app.use(express.static(path.join(__dirname, '../frontend/js')));

// ==========================================
// RUTAS
// ==========================================
// Ruta raíz: abre la pantalla de login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/login.html'));
});

// Rutas de autenticación montadas en el prefijo /api
// Maneja: POST /api/registro y POST /api/login
app.use('/api', authRoutes);

// ==========================================
// INICIALIZACIÓN DEL SERVIDOR
// ==========================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`👉 Abre en tu navegador: http://localhost:${PORT}`);
});
