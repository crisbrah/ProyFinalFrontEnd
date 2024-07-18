import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { FaWarehouse, FaUsers, FaChurch, FaMoneyBillWave, FaCertificate, FaGraduationCap, FaSignOutAlt, FaBars, FaList, FaCalendarAlt, FaBuilding, FaFileAlt, FaUserGraduate } from 'react-icons/fa'

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  }

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  }

  const menuItems = [
    { to: "/home", icon: FaWarehouse, text: "Home", roles: ["admin", "tesorero", "secretario"] },
    { to: "/personas", icon: FaUsers, text: "Personas", roles: ["admin", "secretario"] },
    { to: "/miembro", icon: FaUsers, text: "Miembros", roles: ["admin", "secretario"] },
    { to: "/listasPersonas", icon: FaList, text: "Lista de Personas", roles: ["admin", "secretario"] },
    { to: "/eventosPersonas", icon: FaCalendarAlt, text: "Eventos Personas", roles: ["admin", "secretario"] },
    { to: "/ministerios", icon: FaChurch, text: "Ministerios", roles: ["admin", "secretario"] },
    { to: "/celulas", icon: FaChurch, text: "Células", roles: ["admin", "secretario"] },
    { to: "/anexos", icon: FaBuilding, text: "Anexos", roles: ["admin", "secretario"] },
    { to: "/tesoreria", icon: FaMoneyBillWave, text: "Tesorería", roles: ["admin", "tesorero"] },
    { to: "/ingresos", icon: FaMoneyBillWave, text: "Ingresos", roles: ["admin", "tesorero"] },
    { to: "/egresos", icon: FaMoneyBillWave, text: "Egresos", roles: ["admin", "tesorero"] },
    { to: "/emisionCertificados", icon: FaCertificate, text: "Emisión Certificados", roles: ["admin", "secretario"] },
    { to: "/usuarios", icon: FaUsers, text: "Usuarios", roles: ["admin"] },
    { to: "/cursos", icon: FaGraduationCap, text: "Cursos", roles: ["admin", "secretario"] },
    { to: "/profesores", icon: FaUserGraduate, text: "Profesores", roles: ["admin", "secretario"] },
  ];
  console.log('Current userRole:', userRole);
  console.log('Filtered menu items:', menuItems.filter(item => item.roles.includes(userRole)));

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <button onClick={toggleDrawer} className="text-gray-500 hover:text-gray-700">
          <FaBars size={24} />
        </button>
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Iglesia SD</span>
      </div>

      {/* Navigation Drawer */}
      <div className={`fixed inset-y-0 left-0 transform ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"} w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-20 overflow-y-auto`}>
        <div className="p-5">
          <h2 className="text-2xl font-semibold mb-5">Menú</h2>
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              (item.roles.includes(userRole) || userRole === 'admin') && (
                <li key={index}>
                  <Link to={item.to} className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100">
                    <item.icon className="w-6 h-6" />
                    <span className="ml-3">{item.text}</span>
                  </Link>
                </li>
              )
            ))}
            <li>
              <button onClick={handleLogout} className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 w-full">
                <FaSignOutAlt className="w-6 h-6" />
                <span className="ml-3">Cerrar Sesión</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleDrawer}
        ></div>
      )}
    </nav>
  )
}

export default Navbar