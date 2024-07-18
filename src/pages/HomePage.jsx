import React, { useState, useEffect } from 'react';
import { personaService } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HomePage = () => {
  const [birthdayData, setBirthdayData] = useState({});
  const [weeklyBirthdays, setWeeklyBirthdays] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAndProcessBirthdayData();
  }, []);

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

  const fetchAndProcessBirthdayData = async () => {
    const people = await fetchPeople();
    const monthlyBirthdays = processMonthlyBirthdays(people);
    setBirthdayData(monthlyBirthdays);
    const thisWeekBirthdays = filterBirthdaysThisWeek(people);
    setWeeklyBirthdays(thisWeekBirthdays);
  };

  const processMonthlyBirthdays = (people) => {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const birthdayCounts = new Array(12).fill(0);

    people.forEach(person => {
      if (person.fechaNacimiento) {
        const birthDate = new Date(person.fechaNacimiento);
        birthdayCounts[birthDate.getMonth()]++;
      }
    });

    return {
      labels: months,
      datasets: [{
        label: 'Cumpleaños por mes',
        data: birthdayCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };
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

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribución de Cumpleaños por Mes',
      },
    },
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Bienvenido a Home
      </Typography>
      
      {error && (
        <Box className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <Typography variant="body1"><strong>Error: </strong>{error}</Typography>
        </Box>
      )}

      <Box mt={4}>
        <Typography variant="h5" component="h2" gutterBottom>
          Cumpleaños de esta semana
        </Typography>
        {weeklyBirthdays.length > 0 ? (
          <List>
            {weeklyBirthdays.map((person) => (
              <ListItem key={person.idPersona}>
                <ListItemText 
                  primary={`${person.nombres} ${person.apePat} ${person.apeMat}`}
                  secondary={formatDate(person.fechaNacimiento)}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1">No hay cumpleaños esta semana.</Typography>
        )}
      </Box>

      {birthdayData.labels && (
        <Box mt={4}>
          <Bar data={birthdayData} options={chartOptions} />
        </Box>
      )}
    </Container>
  );
};

export default HomePage;