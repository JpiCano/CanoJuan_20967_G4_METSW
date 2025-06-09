const container = document.querySelector(".container")
const btnSignIn = document.getElementById("btn-sign-in")
const btnSignUp = document.getElementById("btn-sign-up")

// Selecciona el enlace por su ID
const forgotPasswordLink = document.getElementById('forgot-password');

// Modal y botón de cierre
const modal = document.getElementById('password-modal');
const closeModal = document.querySelector('.close-modal');


// Botones
btnSignIn.addEventListener("click",()=>{
    container.classList.remove("toggle");
});
btnSignUp.addEventListener("click",()=>{
    container.classList.add("toggle");
});
// Cargar usuario predeterminado al inicio (si no existe)
document.addEventListener('DOMContentLoaded', () => {
    const defaultUser = { 
        name: "Admin", 
        email: "jpcano@espe.edu.ec", 
        password: "12345" 
    };
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const defaultUserExists = users.some(user => user.email === defaultUser.email);
    
    if (!defaultUserExists) {
        users.push(defaultUser);
        localStorage.setItem('users', JSON.stringify(users));
    }
});

// Validar inicio de sesión (para usuarios registrados o predeterminado)
document.querySelector('.sign-in').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = this.querySelector('input[type="text"]').value;
    const password = this.querySelector('input[type="password"]').value;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
        // Guardar el usuario actual en sessionStorage (opcional, para uso futuro)
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = "principal.html";
    } else {
        alert("Credenciales incorrectas. Verifica tu email o contraseña.");
    }
});

// Registrar nuevo usuario
document.querySelector('.sign-up').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = this.querySelector('input[placeholder="Nombre"]').value;
    const email = this.querySelector('input[placeholder="Email"]').value;
    const password = this.querySelector('input[placeholder="Contraseña"]').value;
    
    if (!name || !email || !password) {
        alert("Todos los campos son obligatorios.");
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const emailExists = users.some(user => user.email === email);
    
    if (emailExists) {
        alert("Este email ya está registrado.");
        return;
    }
    
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert(`¡Bienvenido/a, ${name}! Ahora puedes iniciar sesión.`);
    this.reset();
});

// Abrir modal
forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'block';
    console.log('Modal abierto'); // Para depuración
});

// Cerrar modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Verificación adicional
console.log('Script cargado'); // Confirma que el JS se está ejecutando