import React, { useState, useEffect } from 'react';
import { ingresoService, personaService, miembroService } from '../utils/api';
import { FaMoneyBillWave, FaUserCircle, FaCreditCard } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Ingresos = () => {
  const [ingresos, setIngresos] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [miembros, setMiembros] = useState([]);
  const [formData, setFormData] = useState({
    concepto: '',
    monto: '',
    metodoPago: '',
    idPersona: '',
    idMiembro: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchIngresos();
    fetchPersonas();
    fetchMiembros();
  }, []);

  const fetchIngresos = async () => {
    setIsLoading(true);
    try {
      const response = await ingresoService.getAll();
      setIngresos(response.data);
    } catch (error) {
      console.error('Error fetching ingresos:', error);
      toast.error('No se pudieron cargar los ingresos');
    }
    setIsLoading(false);
  };

  const fetchPersonas = async () => {
    try {
      const response = await personaService.getAll();
      setPersonas(response.data);
    } catch (error) {
      console.error('Error fetching personas:', error);
      toast.error('No se pudieron cargar las personas');
    }
  };

  const fetchMiembros = async () => {
    try {
      const response = await miembroService.getAll();
      setMiembros(response.data);
    } catch (error) {
      console.error('Error fetching miembros:', error);
      toast.error('No se pudieron cargar los miembros');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await ingresoService.create(formData);
      toast.success('Ingreso registrado con éxito');
      fetchIngresos();
      setFormData({
        concepto: '',
        monto: '',
        metodoPago: '',
        idPersona: '',
        idMiembro: ''
      });
    } catch (error) {
      console.error('Error submitting ingreso:', error);
      toast.error('Error al registrar el ingreso');
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Registro de Ingresos</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Nuevo Ingreso</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Concepto</label>
              <input
                type="text"
                name="concepto"
                value={formData.concepto}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Monto</label>
              <input
                type="number"
                name="monto"
                value={formData.monto}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
              <select
                name="metodoPago"
                value={formData.metodoPago}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              >
                <option value="">Seleccione un método</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Plin">Plin</option>
                <option value="Yape">Yape</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Persona</label>
              <select
                name="idPersona"
                value={formData.idPersona}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              >
                <option value="">Seleccione una persona</option>
                {personas.map(persona => (
                  <option key={persona.idPersona} value={persona.idPersona}>
                    {`${persona.nombres} ${persona.apePat} ${persona.apeMat}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Miembro</label>
              <select
                name="idMiembro"
                value={formData.idMiembro}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              >
                <option value="">Seleccione un miembro</option>
                {miembros.map(miembro => (
                  <option key={miembro.idMiembro} value={miembro.idMiembro}>
                    {`Miembro ID: ${miembro.idMiembro}`}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrar Ingreso'}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Últimos Ingresos</h2>
          {isLoading ? (
            <p className="text-center">Cargando ingresos...</p>
          ) : (
            <div className="space-y-4">
              {ingresos.slice(0, 5).map((ingreso, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-md flex items-center justify-between">
                  <div className="flex items-center">
                    <FaMoneyBillWave className="text-green-500 mr-3 text-xl" />
                    <div>
                      <p className="font-semibold">{ingreso.concepto}</p>
                      <p className="text-sm text-gray-600">{new Date(ingreso.dateCreate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${ingreso.monto}</p>
                    <p className="text-sm flex items-center justify-end">
                      <FaCreditCard className="mr-1" /> {ingreso.metodoPago}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Ingresos;