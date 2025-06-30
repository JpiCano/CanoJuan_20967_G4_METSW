import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./RegistroHuesped.css";

function RegistroHuesped() {
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [habitacion, setHabitacion] = useState("");
  const [precio, setPrecio] = useState("");
  const [habitaciones, setHabitaciones] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener habitaciones disponibles
    const fetchHabitaciones = async () => {
      const querySnapshot = await getDocs(collection(db, "habitaciones"));
      const lista = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Habitaciones:", lista); // <-- Agrega esto
      setHabitaciones(lista);
    };
    fetchHabitaciones();
  }, []);

  // Si seleccionas una habitación, puedes autocompletar el precio si lo deseas
  useEffect(() => {
    const habitacionSeleccionada = habitaciones.find(h => h.id === habitacion);
    if (habitacionSeleccionada) {
      setPrecio(habitacionSeleccionada.precio || "");
    } else {
      setPrecio("");
    }
  }, [habitacion, habitaciones]);

  const validarCedulaEcuatoriana = (cedula) => {
    if (!/^\d{10}$/.test(cedula)) return false;
    const digitos = cedula.split('').map(Number);
    const provincia = parseInt(cedula.substring(0, 2), 10);
    if (provincia < 1 || provincia > 24) return false;
    let suma = 0;
    for (let i = 0; i < 9; i++) {
      let valor = digitos[i];
      if (i % 2 === 0) {
        valor *= 2;
        if (valor > 9) valor -= 9;
      }
      suma += valor;
    }
    const verificador = (10 - (suma % 10)) % 10;
    return verificador === digitos[9];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!nombre || !cedula || !habitacion || !precio) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (!validarCedulaEcuatoriana(cedula)) {
      setError("Cédula ecuatoriana inválida.");
      return;
    }
    try {
      const habitacionSeleccionada = habitaciones.find(h => h.id === habitacion);
      await addDoc(collection(db, "huespedes"), {
        nombre,
        cedula,
        habitacionId: habitacion,
        habitacionNombre: habitacionSeleccionada?.nombre || "",
        precio: Number(precio),
        horaIngreso: new Date()
      });
      setNombre("");
      setCedula("");
      setHabitacion("");
      setPrecio("");
      setSuccess("¡Huésped registrado correctamente!");
    } catch (err) {
      setError("Error al registrar huésped");
    }
  };

  return (
    <div className="registro-bg">
      <form className="registro-form" onSubmit={handleSubmit}>
        <h2>Registrar Huésped</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Cédula"
          value={cedula}
          onChange={e => setCedula(e.target.value)}
          required
        />
        <select
          value={habitacion}
          onChange={e => setHabitacion(e.target.value)}
          required
        >
          <option value="">Selecciona una habitación</option>
          {habitaciones.map(h => (
            <option key={h.id} value={h.id}>
              {h.nombre}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={e => setPrecio(e.target.value)}
          required
          min="0"
        />
        <button type="submit">Registrar</button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button
          type="button"
          className="panel-btn"
          onClick={() => navigate("/")}
        >
          Ver huéspedes registrados
        </button>
      </form>
    </div>
  );
}

export default RegistroHuesped;