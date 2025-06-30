import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    // Aquí puedes agregar más validaciones si es necesario

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError(traducirErrorFirebase(err.message));
    }
  };

  function traducirErrorFirebase(error) {
    if (!error) return "";
    if (error.includes("auth/invalid-credential") || error.includes("auth/wrong-password")) {
      return "Correo o contraseña incorrectos.";
    }
    if (error.includes("auth/user-not-found")) {
      return "Usuario no encontrado.";
    }
    if (error.includes("auth/too-many-requests")) {
      return "Demasiados intentos. Intenta más tarde.";
    }
    // Puedes agregar más casos según tus necesidades
    return "Ocurrió un error. Intenta de nuevo.";
  }

  return (
    <div className="login-bg">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>HOTEL LUXUR DREAM</h2>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar Sesión</button>
        {error && <p className="error">{error}</p>}
        {success && <p>{success}</p>}
      </form>
    </div>
  );
}

export default Login;