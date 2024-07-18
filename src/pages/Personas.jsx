import React, { useState, useEffect } from 'react';
import { personaService } from '../utils/api'; 
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Personas = () => {

  const generarPDF = () => {
    const doc = new jsPDF();
    
    // Título del documento
    doc.text('Reporte de Personas', 10, 11);
    
    // Definir las columnas para la tabla
    const columns = [
      { header: 'Nombres', dataKey: 'nombres' },
      { header: 'Apellido', dataKey: 'apePat'},
      { header: 'Fecha Nacimiento', dataKey: 'fechaNacimiento' },
      { header: 'Lugar de Nacimiento', dataKey: 'lugarNacimiento' },
      { header: 'Estado Civil', dataKey: 'esCivil' },
      { header: 'Numero de Hijos', dataKey: 'numHijos' },
      { header: 'DNI', dataKey: 'dni' },
      { header: 'Email', dataKey: 'email' },
    ];
    
    // Generar la tabla
    doc.autoTable({
      columns: columns,
      body: personas,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 66, 66] },
    });
    
    // Guardar el PDF
    doc.save('reporte_personas.pdf');
    console.log('Generando PDF...'); 
  }

  const [personas, setPersonas] = useState([]);
  const [formData, setFormData] = useState({
    dni: '',
    nombres: '',
    apePat: '',
    apeMat: '',
    fechaNacimiento: '',
    lugarNacimiento: '',
    esCivil: '',
    numHijos: '',
    ocupacion: '',
    direccion: '',
    distrito: '',
    provincia: '',
    departamento: '',
    email: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

/*   useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    try {
      const response = await personaService.getAll();
      setPersonas(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching personas:', error);
      setError('No se pudo cargar la lista de personas. Por favor, intente de nuevo más tarde.');
    }
  };
 */
  useEffect(() => {
    async function fetchPersonas(){
      try {
        const response = await personaService.getAll();
        setPersonas(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching personas:', error);
        setError('No se pudo cargar la lista de personas. Por favor, intente de nuevo más tarde.');
      }

    }
    fetchPersonas()
  }, []);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

/*   const handleDniSubmit = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      try {
        const response = await axios.get(`http://localhost:52337/ms-perez-huatuco/v1/persona/buscardni/${formData.dni}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const { nombres, apePat, apeMat } = response.data;
        setFormData(prev => ({
          ...prev,
          nombres,
          apePat,
          apeMat
        }));
      } catch (error) {
        console.error('Error fetching person data:', error);
        setError('No se pudo obtener la información de la persona. Por favor, verifique el DNI e intente de nuevo.');
      }
    }
  }; */

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await personaService.update(editingId, formData);
        async function fetchPersonas(){
          const response = await personaService.getAll();
          setPersonas(response.data);
        }
        fetchPersonas();
        toast.success('Persona actualizada correctamente');
        

      } else {
        await personaService.create(formData);
        async function fetchPersonas(){
          const response = await personaService.getAll();
          setPersonas(response.data);
        }
        fetchPersonas();
        toast.success('Persona creada correctamente');
      }
      fetchPersonas();
      setFormData({
        dni: '',
        nombres: '',
        apePat: '',
        apeMat: '',
        fechaNacimiento: '',
        lugarNacimiento: '',
        esCivil: '',
        numHijos: '',
        ocupacion: '',
        direccion: '',
        distrito: '',
        provincia: '',
        departamento: '',
        email: ''
      });
      setEditingId(null);
      setError(null);
    } catch (error) {
      //console.error('Error submitting form:', error);
      //setError('Hubo un error al guardar los datos. Por favor, intente de nuevo.');
      toast.error('Error al guardar los datos');
    }
  };

  const handleEdit = (persona) => {
    setFormData({
      dni: persona.dni,
      nombres: persona.nombres,
      apePat: persona.apePat,
      apeMat: persona.apeMat,
      fechaNacimiento: persona.fechaNacimiento,
      lugarNacimiento: persona.lugarNacimiento,
      esCivil: persona.esCivil,
      numHijos: persona.numHijos,
      ocupacion: persona.ocupacion,
      direccion: persona.direccion,
      distrito: persona.distrito,
      provincia: persona.provincia,
      departamento: persona.departamento,
      email: persona.email
    });
    setEditingId(persona.idPersona);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta persona?')) {
      try {
        await personaService.delete(id);
        fetchPersonas();
        setError(null);
        toast.success('Persona eliminada correctamente');
      } catch (error) {
        console.error('Error deleting persona:', error);
        setError('No se pudo eliminar la persona. Por favor, intente de nuevo más tarde.');
        toast.error('Error al eliminar la persona');
      }
    }
  };
  return (
    <div className="container mx-auto p-4">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gestión de Personas</h1>
            {error && <div className="bg-red-100 text-left py-3 px-4 uppercase font-semibold text-sm-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>}


            <form onSubmit={handleSubmit} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="mb-1">
                  <label className="block text-gray-700 text-sm font-bold mb-0" htmlFor="dni">
                    DNI
                  </label>
                  <input
                    type="text"
                    name="dni"
                    id="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    //onKeyPress={handleDniSubmit}
                    className="shadow appearance-none text-left py-2 px-3 text-xs w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="DNI"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 text-sm font-bold mb-0" htmlFor="nombres">
                    Nombres
                  </label>
                  <input
                    type="text"
                    name="nombres"
                    id="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    className="shadow appearance-none text-left py-2 px-3 text-xs w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Nombres"
                    readOnly
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 text-sm font-bold mb-0" htmlFor="apePat">
                    Apellido Paterno
                  </label>
                  <input
                    type="text"
                    name="apePat"
                    id="apePat"
                    value={formData.apePat}
                    onChange={handleInputChange}
                    className="shadow appearance-none text-left py-2 px-3 text-xs w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Apellido Paterno"
                    readOnly
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 text-sm font-bold mb-0" htmlFor="apeMat">
                    Apellido Materno
                  </label>
                  <input
                    type="text"
                    name="apeMat"
                    id="apeMat"
                    value={formData.apeMat}
                    onChange={handleInputChange}
                    className="shadow appearance-none text-left py-2 px-3 text-xs w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Apellido Materno"
                    readOnly
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 text-sm font-bold mb-0" htmlFor="fechaNacimiento">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    id="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleInputChange}
                    className="shadow appearance-none text-left py-2 px-3 text-xs w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 text-sm font-bold mb-0" htmlFor="lugarNacimiento">
                    Lugar de Nacimiento
                  </label>
                  <input
                    type="text"
                    name="lugarNacimiento"
                    id="lugarNacimiento"
                    value={formData.lugarNacimiento}
                    onChange={handleInputChange}
                    className="shadow appearance-none text-left py-2 px-3 text-xs w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Lugar de Nacimiento"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 text-sm font-bold mb-0" htmlFor="esCivil">
                    Estado Civil
                  </label>
                  <input
                    type="text"
                    name="esCivil"
                    id="esCivil"
                    value={formData.esCivil}
                    onChange={handleInputChange}
                    className="shadow appearance-none text-left py-2 px-3 text-xs w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Estado Civil"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 text-sm font-bold mb-0" htmlFor="numHijos">
                    Número de Hijos
                  </label>
                  <input
                    type="number"
                    name="numHijos"
                    id="numHijos"
                    value={formData.numHijos}
                    onChange={handleInputChange}
                    className="shadow appearance-none text-left py-2 px-3 text-xs w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Número de Hijos"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 text-sm font-bold mb-0" htmlFor="ocupacion">
                    Ocupación
                  </label>
                  <input
                    type="text"
                    name="ocupacion"
                    id="ocupacion"
                    value={formData.ocupacion}
                    onChange={handleInputChange}
                    className="shadow appearance-none text-left py-2 px-3 text-xs w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Ocupación"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 text-sm font-bold mb-0" htmlFor="direccion">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    id="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    className="shadow appearance-none text-left py-2 px-3 text-xs w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Dirección"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 text-sm font-bold mb-0" htmlFor="distrito">
                    Distrito
                  </label>
                  <input
                    type="text"
                    name="distrito"
                    id="distrito"
                    value={formData.distrito}
                    onChange={handleInputChange}
                    className="shadow appearance-none text-left py-2 px-3 text-xs w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Distrito"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 text-sm font-bold mb-0" htmlFor="provincia">
                    Provincia
                  </label>
                  <input
                    type="text"
                    name="provincia"
                    id="provincia"
                    value={formData.provincia}
                    onChange={handleInputChange}
                    className="shadow appearance-none text-left py-2 px-3 text-xs w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Provincia"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 text-sm font-bold mb-0" htmlFor="departamento">
                    Departamento
                  </label>
                  <input
                    type="text"
                    name="departamento"
                    id="departamento"
                    value={formData.departamento}
                    onChange={handleInputChange}
                    className="shadow appearance-none text-left py-2 px-3 text-xs w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Departamento"
                  />
                </div>
                <div className="mb-1">
                  <label className="block text-gray-700 text-sm font-bold mb-0" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="shadow appearance-none text-left py-2 px-3 text-xs w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="correo"
                  />
                </div>
              </div>
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                {editingId ? 'Actualizar' : 'Crear'} Persona
              </button>
              <button 
              onClick={generarPDF} 
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">
              Generar PDF
              </button>
            </form>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Nombre Completo</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Fecha Nacimiento</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Lugar Nacimiento</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Estado Civil</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Número Hijos</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">DNI</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {personas.map((persona) => (
                    <tr key={persona.idPersona}>
                      <td className="text-left py-3 px-4">{`${persona.nombres} ${persona.apePat} ${persona.apeMat}`}</td>
                      <td className="text-left py-3 px-4">{persona.fechaNacimiento}</td>
                      <td className="text-left py-3 px-4">{persona.lugarNacimiento}</td>
                      <td className="text-left py-3 px-4">{persona.esCivil}</td>
                      <td className="text-left py-3 px-4">{persona.numHijos}</td>
                      <td className="text-left py-3 px-4">{persona.dni}</td>
                      <td className="text-left py-3 px-4">{persona.email}</td>
                      <td className="text-left py-3 px-4">
                        <button onClick={() => handleEdit(persona)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2">
                          Editar
                        </button>
                        <button onClick={() => handleDelete(persona.idPersona)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Personas;