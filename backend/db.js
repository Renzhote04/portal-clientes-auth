// db.js - Conexión a la base de datos MySQL
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',            // Tu usuario de MySQL
  password: '3862', // Tu contraseña de MySQL
  database: 'clients_db',  // Nombre de tu base de datos
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Prueba de conexión al cargar
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión exitosa a la base de datos MySQL (clients_db)');
    connection.release();
  } catch (error) {
    console.error('❌ Error al conectar con MySQL:', error.message);
  }
}

testConnection();

module.exports = pool;
