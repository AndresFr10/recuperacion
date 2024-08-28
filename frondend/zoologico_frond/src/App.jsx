// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Modal from 'react-modal';

const API_URL = 'http://localhost:5000'; // Cambia esto a la URL de tu API si es necesario

Modal.setAppElement('#root'); // Necesario para accesibilidad del modal

function App() {
  const [animales, setAnimales] = useState([]);
  const [nombre, setNombre] = useState('');
  const [zonaZoologico, setZonaZoologico] = useState('');
  const [alimentacion, setAlimentacion] = useState('');
  const [animalEdit, setAnimalEdit] = useState('');
  const [editNombre, setEditNombre] = useState('');
  const [editZonaZoologico, setEditZonaZoologico] = useState('');
  const [editAlimentacion, setEditAlimentacion] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Consultar animales
  const fetchAnimales = async () => {
    try {
      const response = await fetch(`${API_URL}/consultar_animales`);
      const data = await response.json();
      setAnimales(data);
    } catch (error) {
      console.error('Error al consultar animales:', error);
    }
  };

  useEffect(() => {
    fetchAnimales();
  }, []);

  // Crear un animal
  const crearAnimal = async () => {
    if (nombre && zonaZoologico && alimentacion) {
      try {
        await fetch(`${API_URL}/crear_animal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nombre, zona_zoologico: zonaZoologico, alimentacion }),
        });
        fetchAnimales();
        setNombre('');
        setZonaZoologico('');
        setAlimentacion('');
      } catch (error) {
        console.error('Error al crear animal:', error);
      }
    } else {
      alert('Por favor, completa todos los campos.');
    }
  };

  // Eliminar un animal
  const eliminarAnimal = async (nombre) => {
    try {
      await fetch(`${API_URL}/eliminar_animal/${nombre}`, {
        method: 'DELETE',
      });
      fetchAnimales();
    } catch (error) {
      console.error('Error al eliminar animal:', error);
    }
  };

  // Obtener datos del animal para editar
  const obtenerDatosAnimal = async (nombre) => {
    try {
      const response = await fetch(`${API_URL}/dato_animal/${nombre}`);
      const data = await response.json();
      if (data.estado === false) {
        alert(data.msg);
      } else {
        setAnimalEdit(nombre);
        setEditNombre(data.nombre);
        setEditZonaZoologico(data.zona_zoologico);
        setEditAlimentacion(data.alimentacion);
        setModalIsOpen(true);
      }
    } catch (error) {
      console.error('Error al obtener datos del animal:', error);
    }
  };

  // Editar un animal
  const editarAnimal = async () => {
    if (editNombre && editZonaZoologico && editAlimentacion) {
      try {
        await fetch(`${API_URL}/editar_animal/${animalEdit}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nombre: editNombre, zona_zoologico: editZonaZoologico, alimentacion: editAlimentacion }),
        });
        fetchAnimales();
        setModalIsOpen(false);
        setAnimalEdit('');
        setEditNombre('');
        setEditZonaZoologico('');
        setEditAlimentacion('');
      } catch (error) {
        console.error('Error al editar animal:', error);
      }
    } else {
      alert('Por favor, completa todos los campos.');
    }
  };

  return (
    <div>
      <h1>Gestión de zoloogico</h1>
      <div className="container">
        <div className="form-container">
          <h2>Crear Animal</h2>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="text"
            placeholder="Zona Zoológica"
            value={zonaZoologico}
            onChange={(e) => setZonaZoologico(e.target.value)}
          />
          <input
            type="text"
            placeholder="Alimentación"
            value={alimentacion}
            onChange={(e) => setAlimentacion(e.target.value)}
          />
          <button onClick={crearAnimal}>Crear Animal</button>
        </div>

        <div className="table-container">
          <h2>Animales</h2>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Zona Zoológica</th>
                <th>Alimentación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {animales.map((animal) => (
                <tr key={animal.nombre}>
                  <td>{animal.nombre}</td>
                  <td>{animal.zona_zoologico}</td>
                  <td>{animal.alimentacion}</td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => obtenerDatosAnimal(animal.nombre)}
                    >
                      Editar
                    </button>
                    <button
                      className="delete"
                      onClick={() => eliminarAnimal(animal.nombre)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>Editar Animal</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={editNombre}
          onChange={(e) => setEditNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Zona Zoológica"
          value={editZonaZoologico}
          onChange={(e) => setEditZonaZoologico(e.target.value)}
        />
        <input
          type="text"
          placeholder="Alimentación"
          value={editAlimentacion}
          onChange={(e) => setEditAlimentacion(e.target.value)}
        />
        <div className="actions">
          <button onClick={editarAnimal}>Actualizar Animal</button>
          <button className="close" onClick={() => setModalIsOpen(false)}>Cerrar</button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
