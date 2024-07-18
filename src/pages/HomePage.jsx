import React, { useState, useEffect } from 'react';
import { personaService } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { TextField, Box, Container, Typography } from '@mui/material';

const HomePage = () => {
  const [birthdayPeople, setBirthdayPeople] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (startDate && endDate) {
      filterBirthdaysByDateRange();
    } else {
      fetchAndFilterBirthdayPeople();
    }
  }, [startDate, endDate]);

  const fetchPeople = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }
      const response = await personaService.getAll(token);
      return response.data;
    } catch (error) {
      console.error('Error fetching people:', error);
      if (error.response && error.response.status === 401) {
        setError('Sesión expirada. Por favor, inicie sesión nuevamente.');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError('No se pudo cargar la lista de cumpleaños. Por favor, intente de nuevo más tarde.');
      }
      return [];
    }
  };

  const fetchAndFilterBirthdayPeople = async () => {
    const people = await fetchPeople();
    const filteredPeople = filterBirthdaysThisWeek(people);
    setBirthdayPeople(filteredPeople);
  };

  const filterBirthdaysByDateRange = async () => {
    const people = await fetchPeople();
    const filteredPeople = people.filter(person => {
      if (!person.fechaNacimiento) return false;
      const birthDate = new Date(person.fechaNacimiento);
      const birthDateThisYear = new Date(new Date().getFullYear(), birthDate.getMonth(), birthDate.getDate());
      return birthDateThisYear >= dateRange[0] && birthDateThisYear <= dateRange[1];
    });
    setBirthdayPeople(filteredPeople);
  };

  const filterBirthdaysThisWeek = (people) => {
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));
    
    return people.filter(person => {
      if (!person.fechaNacimiento) return false;
      const birthDate = new Date(person.fechaNacimiento);
      const birthDateThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
      
      return birthDateThisYear >= startOfWeek && birthDateThisYear <= endOfWeek;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    const options = { month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Bienvenido a Home
      </Typography>
      
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <DatePicker
            label="Fecha inicial"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="Fecha final"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
      </LocalizationProvider>

      <Typography variant="h5" component="h2" gutterBottom>
        {startDate && endDate 
          ? `Cumpleaños del ${formatDate(startDate)} al ${formatDate(endDate)}`
          : 'Cumpleaños de esta semana'}
      </Typography>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {birthdayPeople.length > 0 ? (
        <ul className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          {birthdayPeople.map((person) => (
            <li key={person.idPersona} className="mb-2 pb-2 border-b last:border-b-0">
              <span className="font-semibold">{`${person.nombres} ${person.apePat} ${person.apeMat}`}</span>
              <span className="ml-2 text-gray-600">
                {formatDate(person.fechaNacimiento)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No hay cumpleaños en el período seleccionado.</p>
      )}
    </Container>
  );
};

export default HomePage;