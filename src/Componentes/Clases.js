import React, { useState, useEffect } from 'react';
import './estiloclases.css';

const Clases = ({ volverInicio }) => {
  // 1. Estado de Clases (con inicialización perezosa)
  const [clases, setClases] = useState(() => {
    const storedClases = localStorage.getItem('clases');
    return storedClases ? JSON.parse(storedClases) : [];
  });
  
  // 2. Estado para leer los docentes disponibles
  const [docentesDisponibles, setDocentesDisponibles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({ 
    id: '', 
    nombre: '', 
    docenteId: '' // Aquí guardamos el ID del maestro, no su nombre
  });

  // Cargar docentes al montar el componente
  useEffect(() => {
    const storedDocentes = JSON.parse(localStorage.getItem('docentes')) || [];
    setDocentesDisponibles(storedDocentes);
  }, []);

  // Guardar clases automáticamente cuando cambien
  useEffect(() => {
    localStorage.setItem('clases', JSON.stringify(clases));
  }, [clases]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setClases(clases.map((clase) => clase.id === formData.id ? formData : clase));
      setIsEditing(false);
    } else {
      const nuevaClase = { ...formData, id: Date.now().toString() };
      setClases([...clases, nuevaClase]);
    }
    setFormData({ id: '', nombre: '', docenteId: '' });
  };

  const handleEdit = (clase) => {
    setFormData(clase);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta clase? Los alumnos podrían perder su referencia.')) {
      setClases(clases.filter((clase) => clase.id !== id));
    }
  };

  // Helper para mostrar el nombre del maestro en la tabla
  const getNombreDocente = (id) => {
    const docente = docentesDisponibles.find(d => d.id === id);
    return docente ? docente.nombre : 'Docente no encontrado/eliminado';
  };

  return (
    <div className="clases-container">
      {/* 2. Contenedor flex para título y botón */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="clases-titulo" style={{ margin: 0 }}>Gestión de Clases</h2>
        <button 
          onClick={volverInicio} 
          className="btn btn-cancelar" 
          style={{ padding: '8px 15px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          ✖ Cerrar
        </button>
      </div>

      {/* Formulario */}
      <div className="clases-card">
        <h3>{isEditing ? 'Editar Clase' : 'Abrir Nueva Clase'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre de la Clase:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="form-input"
              placeholder="Ej. Programación Web"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Asignar Docente:</label>
            <select
              name="docenteId"
              value={formData.docenteId}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="" disabled>Seleccione un docente...</option>
              {docentesDisponibles.map(docente => (
                <option key={docente.id} value={docente.id}>
                  {docente.nombre} - {docente.especialidad}
                </option>
              ))}
            </select>
            {docentesDisponibles.length === 0 && (
               <p style={{fontSize: '0.8rem', color: '#e74c3c', marginTop: '5px'}}>
                 * Debes registrar un docente primero.
               </p>
            )}
          </div>
          
          <button 
            type="submit" 
            className={`btn ${isEditing ? 'btn-actualizar' : 'btn-guardar'}`}
            disabled={docentesDisponibles.length === 0} // Desactiva si no hay maestros
          >
            {isEditing ? 'Actualizar Clase' : 'Guardar Clase'}
          </button>
          
          {isEditing && (
            <button 
              type="button" 
              onClick={() => { setIsEditing(false); setFormData({ id: '', nombre: '', docenteId: '' }); }} 
              className="btn btn-cancelar"
            >
              Cancelar
            </button>
          )}
        </form>
      </div>

      {/* Tabla de Resultados */}
      <div className="clases-card">
        <h3>Clases Activas</h3>
        {clases.length === 0 ? (
          <p>No hay clases registradas aún.</p>
        ) : (
          <table className="clases-table">
            <thead>
              <tr>
                <th>Nombre de Clase</th>
                <th>Docente Asignado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clases.map((clase) => (
                <tr key={clase.id}>
                  <td>{clase.nombre}</td>
                  <td>
                    <span className="badge-docente">{getNombreDocente(clase.docenteId)}</span>
                  </td>
                  <td>
                    <button className="btn-editar" onClick={() => handleEdit(clase)}>Editar</button>
                    <button className="btn-eliminar" onClick={() => handleDelete(clase.id)}>Eliminar</button>
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

export default Clases;