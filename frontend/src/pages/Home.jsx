// Home.js

import React, { useState, useEffect } from 'react';
import api from '../api';
import Note from '../components/Note';
import Chart from 'chart.js'; // Import de Chart.js
import io from 'socket.io-client'; // Import de socket.io-client
import '../styles/Home.css';

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [sensorData, setSensorData] = useState([]); // Ajout de l'état pour les données des capteurs

  useEffect(() => {
    getNotes();
    setupWebSocket(); // Appel de la fonction pour configurer WebSocket
  }, []);

  const getNotes = () => {
    api
      .get('/api/notes/')
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert('Note deleted!');
        else alert('Failed to delete note.');
        getNotes();
      })
      .catch((error) => alert(error));
  };

  const createNote = (e) => {
    e.preventDefault();
    api
      .post('/api/notes/', { content, title })
      .then((res) => {
        if (res.status === 201) alert('Note created!');
        else alert('Failed to make note.');
        getNotes();
      })
      .catch((err) => alert(err));
  };

  const setupWebSocket = () => {
    const socket = io('http://localhost:8000'); // Remplace localhost:8000 par l'URL de ton serveur WebSocket
    socket.on('sensor_data', (data) => {
      setSensorData(data);
    });
  };

  useEffect(() => {
    // Création du graphique avec Chart.js
    const ctx = document.getElementById('sensorChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sensorData.map((data) => data.timestamp),
        datasets: [
          {
            label: 'Température',
            data: sensorData.map((data) => data.temperature),
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1,
          },
          {
            label: 'Humidité',
            data: sensorData.map((data) => data.humidity),
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'hour',
            },
          },
        },
      },
    });

    return () => chart.destroy(); // Nettoyage du graphique à la fin
  }, [sensorData]);

  return (
    <div>
      <div>
        <h2>Notes</h2>
        {notes.map((note) => (
          <Note note={note} onDelete={deleteNote} key={note.id} />
        ))}
      </div>
      <h2>Create a Note</h2>
      <form onSubmit={createNote}>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <label htmlFor="content">Content:</label>
        <br />
        <textarea
          id="content"
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <br />
        <input type="submit" value="Submit" />
      </form>

      {/* Affichage du graphique des capteurs */}
      <canvas id="sensorChart" width="800" height="400"></canvas>
    </div>
  );
}

export default Home;

