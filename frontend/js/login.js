// login.js - Lógica para enviar credenciales al backend

document.getElementById('formLogin').addEventListener('submit', async function (e) {
  e.preventDefault();

  const usuario = document.getElementById('loginUsuario').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const alerta = document.getElementById('alertaLogin');
  const btn = document.getElementById('btnIngresar');

  try {
    btn.disabled = true;
    btn.innerText = 'Ingresando...';

    // Petición al servidor backend (el servidor valida con bcrypt.compare)
    const respuesta = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: usuario,
        password: password
      })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      alerta.className = 'w3-panel w3-round w3-pale-red w3-text-red w3-show';
      alerta.innerText = datos.error || 'Credenciales incorrectas.';
      btn.disabled = false;
      btn.innerText = 'Ingresar';
      return;
    }

    // Éxito: Guardar datos del usuario en localStorage
    localStorage.setItem('usuarioSesion', JSON.stringify(datos.user));

    alerta.className = 'w3-panel w3-round w3-pale-green w3-text-green w3-show';
    alerta.innerText = '¡Inicio de sesión exitoso! Redirigiendo...';

    setTimeout(() => {
      window.location.href = 'home.html';
    }, 1000);

  } catch (error) {
    console.error('Error de red:', error);
    alerta.className = 'w3-panel w3-round w3-pale-red w3-text-red w3-show';
    alerta.innerText = 'No se pudo conectar con el servidor. ¿Está encendido con node server.js?';
    btn.disabled = false;
    btn.innerText = 'Ingresar';
  }
});
