import React, { useState, useEffect } from 'react';
import { celulaService } from '../utils/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Celulas = () => {
  const [celulas, setCelulas] = useState([]);
  const [formData, setFormData] = useState({
    nombreCelula: '',
    estadoCelula: true
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCelulas();
  }, []);

  const fetchCelulas = async () => {
    try {
      const response = await celulaService.getAll();
      setCelulas(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching celulas:', error);
      setError('No se pudo cargar la lista de células. Por favor, intente de nuevo más tarde.');
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
        await celulaService.update(editingId, formData);
      } else {
        await celulaService.create(formData);
      }
      fetchCelulas();
      setFormData({
        nombreCelula: '',
        estadoCelula: true
      });
      setEditingId(null);
      setError(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Hubo un error al guardar los datos. Por favor, intente de nuevo.');
    }
  };

  const handleEdit = (celula) => {
    setFormData({
      nombreCelula: celula.nombreCelula,
      estadoCelula: celula.estadoCelula
    });
    setEditingId(celula.idCelula);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta célula?')) {
      try {
        await celulaService.delete(id);
        fetchCelulas();
        setError(null);
      } catch (error) {
        console.error('Error deleting celula:', error);
        setError('No se pudo eliminar la célula. Por favor, intente de nuevo más tarde.');
      }
    }
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    
    doc.text('Reporte de Células', 14, 15);
    
    const columns = [
      { header: 'ID', dataKey: 'idCelula' },
      { header: 'Nombre', dataKey: 'nombreCelula' },
      { header: 'Estado', dataKey: 'estadoCelula' },
      { header: 'Usuario Creador', dataKey: 'usuaCrea' },
      { header: 'Fecha Creación', dataKey: 'dateCreate' },
    ];
    
    doc.autoTable({
      columns: columns,
      body: celulas,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 66, 66] },
    });
    
    doc.save('reporte_celulas.pdf');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Células</h1>
      {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>}

      <form onSubmit={handleSubmit} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombreCelula">
            Nombre de la Célula
          </label>
          <input
            type="text"
            name="nombreCelula"
            id="nombreCelula"
            value={formData.nombreCelula}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Nombre de la Célula"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estadoCelula">
            Estado de la Célula
          </label>
          <select
            name="estadoCelula"
            id="estadoCelula"
            value={formData.estadoCelula}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value={true}>Activa</option>
            <option value={false}>Inactiva</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          {editingId ? 'Actualizar' : 'Crear'} Célula
        </button>
        <button 
          onClick={generarPDF} 
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
        >
          Generar PDF
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">ID</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Nombre</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Estado</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Usuario Creador</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Fecha Creación</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {celulas.map((celula) => (
              <tr key={celula.idCelula}>
                <td className="text-left py-3 px-4">{celula.idCelula}</td>
                <td className="text-left py-3 px-4">{celula.nombreCelula}</td>
                <td className="text-left py-3 px-4">{celula.estadoCelula ? 'Activa' : 'Inactiva'}</td>
                <td className="text-left py-3 px-4">{celula.usuaCrea}</td>
                <td className="text-left py-3 px-4">{new Date(celula.dateCreate).toLocaleString()}</td>
                <td className="text-left py-3 px-4">
                  <button onClick={() => handleEdit(celula)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(celula.idCelula)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
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

export default Celulas;