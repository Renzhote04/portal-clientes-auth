// routes/auth.routes.js - Rutas de autenticación (Registro y Login) con Procedimientos Almacenados
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../db');

// ==========================================
// RUTA: POST /api/registro
// ==========================================
router.post('/registro', async (req, res) => {
  try {
    const { name, nombre, email, password } = req.body;
    const finalName = name || nombre;

    // Validación básica de campos recibidos
    if (!finalName || !email || !password) {
      return res.status(400).json({ 
        error: 'Todos los campos son obligatorios (nombre, email, password).' 
      });
    }

    // 1. Encriptar contraseña con bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);

    // 2. Ejecutar Procedimiento Almacenado: sp_registrar_usuario
    const [resultado] = await pool.query(
      'CALL sp_registrar_usuario(?, ?, ?)',
      [finalName, email, passwordHashed]
    );

    const nuevoUsuario = (resultado && resultado[0] && resultado[0][0]) ? resultado[0][0] : null;
    const nuevoId = nuevoUsuario ? nuevoUsuario.id : null;

    console.log(`✅ Usuario registrado con ID: ${nuevoId} (sp_registrar_usuario)`);

    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      id: nuevoId
    });

  } catch (error) {
    // Si el procedimiento arrojó error por correo duplicado (SQLSTATE 45000)
    if (error.sqlState === '45000' || error.code === 'ER_SIGNAL_EXCEPTION') {
      return res.status(409).json({ 
        error: error.message || 'El correo electrónico ya se encuentra registrado.' 
      });
    }

    console.error('❌ Error en el registro:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor al procesar el registro.' 
    });
  }
});

// ==========================================
// RUTA: POST /api/login
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { usuario, email, password } = req.body;
    const emailBuscado = email || usuario;

    if (!emailBuscado || !password) {
      return res.status(400).json({ 
        error: 'Debe ingresar su correo y contraseña.' 
      });
    }

    // 1. Ejecutar Procedimiento Almacenado: sp_obtener_usuario_login
    const [filas] = await pool.query(
      'CALL sp_obtener_usuario_login(?)',
      [emailBuscado]
    );

    const usuarios = filas[0];

    if (!usuarios || usuarios.length === 0) {
      return res.status(401).json({ 
        error: 'El correo electrónico o la contraseña son incorrectos.' 
      });
    }

    const usuarioEncontrado = usuarios[0];

    // 2. Comparar con bcrypt
    const passwordValida = await bcrypt.compare(password, usuarioEncontrado.password);

    if (!passwordValida) {
      return res.status(401).json({ 
        error: 'El correo electrónico o la contraseña son incorrectos.' 
      });
    }

    console.log(`🔑 Login exitoso para: ${usuarioEncontrado.name}`);

    // 3. Responder con datos del usuario sin exponer la contraseña
    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: usuarioEncontrado.id,
        nombre: usuarioEncontrado.name,
        email: usuarioEncontrado.email
      }
    });

  } catch (error) {
    console.error('❌ Error en el login:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor al procesar el login.' 
    });
  }
});

module.exports = router;
