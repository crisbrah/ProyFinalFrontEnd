import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
          navigate('/');
      }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const values = { username, password }
        
        const url='http://localhost:63824/api/v1/autenticacion/signin'
  
        try {
          const resp = await axios.post(url, values);
          console.log('Respuesta:', resp);
         
          const token = resp.data.token;
          localStorage.setItem('token', token);
          
          // Decodificar el token
          const decodedToken = jwtDecode(token);
          console.log('Token decodificado:', decodedToken);
         
          // Extraer el rol del token decodificado
          const role = decodedToken.sub; // o decodedToken.roles[0] si es un array
          console.log('Rol extraído:', role);
          localStorage.setItem('userRole', role);
          
          // Mostrar notificación de éxito
          toast.success('Inicio de sesión exitoso!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          // Redirigir a la página principal después de un breve retraso
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } catch (error) {
          console.error('Error al iniciar sesión:', error);
          toast.error('Error al iniciar sesión. Por favor, intente de nuevo.', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
    }

  return (
    <>
      <ToastContainer />
        <section className="bg-gray-50 dark:bg-gray-900">
          <section className="bg-gray-50 dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16">
              <div className="flex flex-col justify-center">
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Iglesia Sanidad Divina</h1>
              </div>
              <div>
                <div className="w-full lg:max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow-xl dark:bg-gray-800">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Ingresar al Sistema
                  </h2>
                  <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="user" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ingrese Usuario</label>
                      <input 
                        type="text" 
                        name="user" 
                        id="user" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="nombre de usuario" 
                        required 
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                      <input 
                        type="password" 
                        name="password" 
                        id="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        required 
                      />
                    </div>
                    <button type="submit" className="w-full px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login to your account</button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </section>
        </>
  )
}

export default Login