import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LayoutBase from "./layouts/LayoutBase"
import Login from "./auth/Login"
import Personas from "./pages/Personas"
import Miembro from "./pages/Miembro"
import ListaPersonas from "./pages/ListaPersonas"
import EventosPersonas from "./pages/EventosPersonas"
import Ministerios from "./pages/Ministerios"
import Celulas from "./pages/Celulas"
import Anexos from "./pages/Anexos"
import Tesoreria from "./pages/Tesoreria"
import Ingresos from "./pages/Ingresos"
import Egresos from "./pages/Egresos"
import EmisionCertificados from "./pages/EmisionCertificados"
import Usuarios from "./pages/Usuarios"
import Cursos from "./pages/Cursos"
import Profesores from "./pages/Profesores"

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><LayoutBase /></PrivateRoute>}>
          <Route index element={<HomePage />} />
          <Route path="home" element={<HomePage/>} />
          <Route path="personas" element={<PrivateRoute allowedRoles={['admin', 'secretario']}><Personas/></PrivateRoute>} />
          <Route path="miembro" element={<PrivateRoute allowedRoles={['admin', 'secretario']}><Miembro/></PrivateRoute>} />
          <Route path="listasPersonas" element={<PrivateRoute allowedRoles={['admin', 'secretario']}><ListaPersonas/></PrivateRoute>} />
          <Route path="eventosPersonas" element={<PrivateRoute allowedRoles={['admin', 'secretario']}><EventosPersonas/></PrivateRoute>} />
          <Route path="ministerios" element={<PrivateRoute allowedRoles={['admin', 'secretario']}><Ministerios/></PrivateRoute>} />
          <Route path="celulas" element={<PrivateRoute allowedRoles={['admin', 'secretario']}><Celulas/></PrivateRoute>} />
          <Route path="anexos" element={<PrivateRoute allowedRoles={['admin', 'secretario']}><Anexos/></PrivateRoute>} />
          <Route path="tesoreria" element={<PrivateRoute allowedRoles={['admin', 'tesorero']}><Tesoreria/></PrivateRoute>} />
          <Route path="ingresos" element={<PrivateRoute allowedRoles={['admin', 'tesorero']}><Ingresos/></PrivateRoute>} />
          <Route path="egresos" element={<PrivateRoute allowedRoles={['admin', 'tesorero']}><Egresos/></PrivateRoute>} />
          <Route path="emisionCertificados" element={<PrivateRoute allowedRoles={['admin', 'secretario']}><EmisionCertificados/></PrivateRoute>} />
          <Route path="usuarios" element={<PrivateRoute allowedRoles={['admin']}><Usuarios/></PrivateRoute>} />
          <Route path="cursos" element={<PrivateRoute allowedRoles={['admin', 'secretario']}><Cursos/></PrivateRoute>} />
          <Route path="profesores" element={<PrivateRoute allowedRoles={['admin', 'secretario']}><Profesores /></PrivateRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App