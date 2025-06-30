import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

function Panel() {
  const [huespedes, setHuespedes] = useState([]);
  const [tick, setTick] = useState(0); // <-- Nuevo estado
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerHuespedes = async () => {
      const querySnapshot = await getDocs(collection(db, "huespedes"));
      const lista = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHuespedes(lista);
    };
    obtenerHuespedes();

    // Opcional: Actualiza cada minuto para la alarma visual
    const interval = setInterval(obtenerHuespedes, 60000);
    return () => clearInterval(interval);
  }, []);

  // Nuevo useEffect para refrescar la alarma cada segundo
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  // Calcula la hora de salida sumando 3 horas
  const calcularHoraSalida = (horaIngreso) => {
    if (!horaIngreso) return "";
    let fechaIngreso;
    if (horaIngreso.seconds) {
      fechaIngreso = new Date(horaIngreso.seconds * 1000);
    } else {
      fechaIngreso = new Date(horaIngreso);
    }
    const fechaSalida = new Date(fechaIngreso.getTime() + 30 * 1000); // suma 30 segundos
    return fechaSalida;
  };

  // Devuelve true si faltan menos de 10 segundos para la salida
  const estaPorTerminar = (horaIngreso) => {
    const salida = calcularHoraSalida(horaIngreso);
    const ahora = new Date();
    const diff = salida - ahora;
    return diff > 0 && diff <= 10 * 1000; // alarma si faltan menos de 10 segundos
  };

  const tiempoTranscurrido = (horaIngreso) => {
    const salida = calcularHoraSalida(horaIngreso);
    const ahora = new Date();
    const diff = ahora - salida;
    if (diff <= 0) return null; // Solo mostrar si ya pasó la hora de salida

    // Formatea a mm:ss
    const segundos = Math.floor(diff / 1000);
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min.toString().padStart(2, "0")}:${seg.toString().padStart(2, "0")}`;
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Huéspedes Registrados</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2rem" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Nombre</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Cédula</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Habitación</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Precio</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Hora de Ingreso</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Hora de Salida</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Alarma</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {huespedes.map(h => {
            const horaIngreso = h.horaIngreso && (h.horaIngreso.seconds ? new Date(h.horaIngreso.seconds * 1000) : new Date(h.horaIngreso));
            const horaSalida = calcularHoraSalida(h.horaIngreso);
            const alarma = estaPorTerminar(h.horaIngreso);

            return (
              <tr key={h.id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{h.nombre}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{h.cedula}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{h.habitacionNombre || h.habitacionId}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>${h.precio}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {horaIngreso ? horaIngreso.toLocaleString() : ""}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {horaSalida ? horaSalida.toLocaleString() : ""}
                </td>
                <td style={{
                  border: "1px solid #ccc",
                  padding: "8px",
                  background: alarma ? "#ff4e50" : "transparent",
                  color: alarma ? "#fff" : "#000",
                  fontWeight: alarma ? "bold" : "normal"
                }}>
                  {alarma
                    ? "¡Tiempo por terminar!"
                    : tiempoTranscurrido(h.horaIngreso)
                      ? `Tiempo pasado: ${tiempoTranscurrido(h.horaIngreso)}`
                      : ""}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  <button
                    style={{
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "4px 10px",
                      cursor: "pointer"
                    }}
                    onClick={async () => {
                      if (window.confirm("¿Seguro que desea finalizar la estadía de este huésped?")) {
                        await deleteDoc(doc(db, "huespedes", h.id));
                        setHuespedes(huespedes.filter(hu => hu.id !== h.id));
                      }
                    }}
                  >
                    Finalizar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Link to="/registro-huesped" style={{
        background: "#5B21B6",
        color: "#fff",
        padding: "0.75rem 1.5rem",
        borderRadius: "6px",
        textDecoration: "none",
        fontWeight: "bold"
      }}>
        Registrar nuevo huésped
      </Link>
      <br /><br />
      <button
        onClick={handleLogout}
        style={{
          background: "#9333EA",
          color: "#fff",
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          border: "none",
          fontWeight: "bold",
          cursor: "pointer",
          marginBottom: "1rem"
        }}
      >
        Cerrar sesión
      </button>
      <br />
      <Link to="/login">Ir al Login</Link>
    </div>
  );
}

export default Panel;
