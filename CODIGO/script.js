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


// Validación simple del login
document.querySelector('.sign-in').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = this.querySelector('input[type="text"]').value.trim();
    const password = this.querySelector('input[type="password"]').value;

    if (email === "admin@gmail.com" && password === "12345") {
        window.location.href = "principal.html";
    } else {
        alert("Credenciales incorrectas. Verifica tu email o contraseña.");
    }
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