// registro.js - Lógica para enviar el registro al backend

document.getElementById('formRegistro').addEventListener('submit', async function (e) {
  e.preventDefault(); // Evita recargar la página

  const nombre = document.getElementById('regNombre').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const passwordConfirm = document.getElementById('regPasswordConfirm').value;
  const alerta = document.getElementById('alertaRegistro');
  const btn = document.getElementById('btnRegistrar');

  // Validación de coincidencia de contraseña
  if (password !== passwordConfirm) {
    alerta.className = 'w3-panel w3-round w3-pale-red w3-text-red w3-show';
    alerta.innerText = 'Las contraseñas no coinciden.';
    return;
  }

  try {
    btn.disabled = true;
    btn.innerText = 'Registrando...';

    // Enviar al servidor backend (el servidor se encargará del hash con bcrypt)
    const respuesta = await fetch('http://localhost:3000/api/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nombre,
        email: email,
        password: password
      })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      alerta.className = 'w3-panel w3-round w3-pale-red w3-text-red w3-show';
      alerta.innerText = datos.error || 'Ocurrió un error al registrarse.';
      btn.disabled = false;
      btn.innerText = 'Registrarse';
      return;
    }

    // Registro exitoso
    alerta.className = 'w3-panel w3-round w3-pale-green w3-text-green w3-show';
    alerta.innerText = '¡Registro exitoso! Redirigiendo al login...';

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);

  } catch (error) {
    console.error('Error de red:', error);
    alerta.className = 'w3-panel w3-round w3-pale-red w3-text-red w3-show';
    alerta.innerText = 'No se pudo conectar con el servidor. ¿Está encendido con node server.js?';
    btn.disabled = false;
    btn.innerText = 'Registrarse';
  }
});
