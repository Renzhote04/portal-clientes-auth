// home.js - Lógica para mostrar los datos del usuario logueado

document.addEventListener('DOMContentLoaded', () => {
  // 1. Leemos los datos que guardaste en el login desde localStorage
  const usuarioGuardado = localStorage.getItem('usuarioSesion');

  if (!usuarioGuardado) {
    // Si no ha iniciado sesión, lo devolvemos al login
    window.location.href = 'login.html';
    return;
  }

  // Convertimos el texto JSON a un objeto JavaScript
  const user = JSON.parse(usuarioGuardado);

  // 2. Colocamos los campos de la tabla 'user' en el HTML
  if (document.getElementById('saludoCliente')) {
    document.getElementById('saludoCliente').innerText = user.nombre || 'Usuario';
  }
  if (document.getElementById('perfilId')) {
    document.getElementById('perfilId').innerText = user.id ?? '--';
  }
  if (document.getElementById('perfilNombre')) {
    document.getElementById('perfilNombre').innerText = user.nombre || 'No disponible';
  }
  if (document.getElementById('perfilEmail')) {
    document.getElementById('perfilEmail').innerText = user.email || 'No disponible';
  }

  // 3. Botón para cerrar sesión
  const btnCerrarSesion = document.getElementById('btnCerrarSesion');
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', () => {
      // Borramos la sesión y vamos a login
      localStorage.removeItem('usuarioSesion');
      window.location.href = 'login.html';
    });
  }
});
