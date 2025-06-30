import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Panel from "./pages/Panel";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import RegistroHuesped from "./pages/RegistroHuesped";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Panel />
            </PrivateRoute>
          }
        />
        <Route path="/registro-huesped" element={<RegistroHuesped />} />
        {/* Redirige cualquier ruta desconocida al login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
