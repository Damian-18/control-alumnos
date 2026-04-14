import React, { useState, useEffect } from 'react';
import './estilodocente.css';

const Docentes = () => {
  // 1. AFINACIÓN: Leer localStorage directamente al iniciar el estado
  const [docentes, setDocentes] = useState(() => {
    const storedDocentes = localStorage.getItem('docentes');
    return storedDocentes ? JSON.parse(storedDocentes) : [];
  });
  
  const [formData, setFormData] = useState({ id: '', nombre: '', especialidad: '', correo: '' });
  const [isEditing, setIsEditing] = useState(false);

 // 1. CARGA INICIAL (Solo se ejecuta una vez al abrir la pestaña)
    useEffect(() => {
    const datosGuardados = localStorage.getItem('docentes'); // Cambia 'docentes' por 'alumnos' o 'clases' según el archivo
    if (datosGuardados) {
        try {
        const parsed = JSON.parse(datosGuardados);
        // Solo actualizamos el estado si realmente hay datos en el storage
        if (Array.isArray(parsed) && parsed.length > 0) {
            setDocentes(parsed); // Cambia setDocentes por setAlumnos o setClases
        }
        } catch (error) {
        console.error("Error cargando LocalStorage", error);
        }
    }
    }, []);

    // 2. GUARDADO SEGURO (Solo guarda si hay algo que guardar)
    useEffect(() => {
    // Solo guardamos si la lista tiene elementos para evitar borrar el storage por accidente
    if (docentes.length > 0) {
        localStorage.setItem('docentes', JSON.stringify(docentes));
    }
    }, [docentes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      const docentesActualizados = docentes.map((docente) =>
        docente.id === formData.id ? formData : docente
      );
      setDocentes(docentesActualizados);
      setIsEditing(false);
    } else {
      const nuevoDocente = { ...formData, id: Date.now().toString() };
      setDocentes([...docentes, nuevoDocente]);
    }
    setFormData({ id: '', nombre: '', especialidad: '', correo: '' });
  };

  const handleEdit = (docente) => {
    setFormData(docente);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    const confirmar = window.confirm('¿Estás seguro de eliminar a este docente?');
    if (confirmar) {
      const docentesFiltrados = docentes.filter((docente) => docente.id !== id);
      setDocentes(docentesFiltrados);
    }
  };

  return (
    <div className="docentes-container">
      <h2 className="docentes-titulo">Gestión de Docentes</h2>

      {/* Formulario */}
      <div className="docentes-card">
        <h3>{isEditing ? 'Editar Docente' : 'Agregar Nuevo Docente'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre Completo:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Especialidad (Ej. Matemáticas, Programación):</label>
            <input
              type="text"
              name="especialidad"
              value={formData.especialidad}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Correo Electrónico:</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className={`btn ${isEditing ? 'btn-actualizar' : 'btn-guardar'}`}
          >
            {isEditing ? 'Actualizar Docente' : 'Guardar Docente'}
          </button>
          
          {isEditing && (
            <button 
              type="button" 
              onClick={() => { setIsEditing(false); setFormData({ id: '', nombre: '', especialidad: '', correo: '' }); }} 
              className="btn btn-cancelar"
            >
              Cancelar
            </button>
          )}
        </form>
      </div>

      {/* Tabla de Resultados */}
      <div className="docentes-card">
        <h3>Lista de Docentes</h3>
        {docentes.length === 0 ? (
          <p>No hay docentes registrados aún.</p>
        ) : (
          <table className="docentes-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Especialidad</th>
                <th>Correo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {docentes.map((docente) => (
                <tr key={docente.id}>
                  <td>{docente.nombre}</td>
                  <td>{docente.especialidad}</td>
                  <td>{docente.correo}</td>
                  <td>
                    <button className="btn-editar" onClick={() => handleEdit(docente)}>Editar</button>
                    <button className="btn-eliminar" onClick={() => handleDelete(docente.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Docentes;