import React, { useState, useEffect } from 'react';
import { miembroService, personaService } from '../utils/api'; 
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Miembro = () => {
  
  const generarPDF = () => {
    const doc = new jsPDF();
    
    // Título del documento
    doc.text('Reporte de Miembros', 14, 15);
    
    // Definir las columnas para la tabla
    const columns = [
      { header: 'ID', dataKey: 'idMiembro' },
      { header: 'Fecha Conversión', dataKey: 'fechaConversion' },
      { header: 'ID Persona', dataKey: 'idPersona' },
      { header: 'ID Célula', dataKey: 'idCelula' },
    ];
    
    // Generar la tabla
    doc.autoTable({
      columns: columns,
      body: miembros,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 66, 66] },
    });
    
    // Guardar el PDF
    doc.save('reporte_miembros.pdf');
    console.log('Generando PDF...'); 
  }
  
  const [miembros, setMiembros] = useState([]);
  const [formData, setFormData] = useState({
    fechaConversion: '',
    idPersona: '',
    idCelula: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [personas, setPersonas] = useState([]);

  useEffect(() => {
    fetchMiembros();
    fetchPersonas();
  }, []);

  const fetchMiembros = async () => {
    try {
      const response = await miembroService.getAll();
      setMiembros(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching miembros:', error);
      setError('No se pudo cargar la lista de miembros. Por favor, intente de nuevo más tarde.');
    }
  };

  const fetchPersonas = async () => {
    try {
      const response = await personaService.getAll();
      setPersonas(response.data);
    } catch (error) {
      console.error('Error fetching personas:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await miembroService.update(editingId, formData);
      } else {
        await miembroService.create(formData);
      }
      fetchMiembros();
      setFormData({
        fechaConversion: '',
        idPersona: '',
        idCelula: ''
      });
      setEditingId(null);
      setError(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Hubo un error al guardar los datos. Por favor, intente de nuevo.');
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await miembroService.getById(id);
      const miembro = response.data;
      setFormData({
        fechaConversion: miembro.fechaConversion,
        idPersona: miembro.idPersona,
        idCelula: miembro.idCelula
      });
      setEditingId(id);
    } catch (error) {
      console.error('Error fetching miembro:', error);
      setError('No se pudo obtener la información del miembro. Por favor, intente de nuevo.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este miembro?')) {
      try {
        await miembroService.delete(id);
        fetchMiembros();
        setError(null);
      } catch (error) {
        console.error('Error deleting miembro:', error);
        setError('No se pudo eliminar el miembro. Por favor, intente de nuevo más tarde.');
      }
    }

  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Miembros</h1>
      {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>}

      <form onSubmit={handleSubmit} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fechaConversion">
            Fecha de Conversión
          </label>
          <input
            type="date"
            name="fechaConversion"
            id="fechaConversion"
            value={formData.fechaConversion}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="idPersona">
            Persona
          </label>
          <select
            name="idPersona"
            id="idPersona"
            value={formData.idPersona}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Seleccione una persona</option>
            {personas.length > 0 ? (
              personas.map((persona) => (
                <option key={persona.idPersona} value={persona.idPersona}>
                  {`${persona.nombres} ${persona.apePat} ${persona.apeMat}`}
                </option>
              ))
            ) : (
              <option value="">Cargando personas...</option>
            )}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="idCelula">
            ID Célula
          </label>
          <input
            type="text"
            name="idCelula"
            id="idCelula"
            value={formData.idCelula}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="ID Célula"
          />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          {editingId ? 'Actualizar' : 'Crear'} Miembro
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
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">ID</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Fecha Conversión</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">ID Persona</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">ID Célula</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {miembros.map((miembro) => (
              <tr key={miembro.idMiembro}>
                <td className="text-left py-3 px-4">{miembro.idMiembro}</td>
                <td className="text-left py-3 px-4">{miembro.fechaConversion}</td>
                <td className="text-left py-3 px-4">{miembro.idPersona}</td>
                <td className="text-left py-3 px-4">{miembro.idCelula}</td>
                <td className="text-left py-3 px-4">
                  <button onClick={() => handleEdit(miembro.idMiembro)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(miembro.idMiembro)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Miembro;