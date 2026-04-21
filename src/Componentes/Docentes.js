import React, { useState, useEffect } from 'react';
import './estilodocente.css';
import './estiloavisos.css';
import Aviso from './Aviso';
import ConfirmModal from './ConfirmModal';

const Docentes = ({ volverInicio }) => {
  // 1. AFINACIÓN: Leer localStorage directamente al iniciar el estado
  const [docentes, setDocentes] = useState(() => {
    const storedDocentes = localStorage.getItem('docentes');
    return storedDocentes ? JSON.parse(storedDocentes) : [];
  });
  
  const [formData, setFormData] = useState({ id: '', nombre: '', especialidad: '', correo: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState({ tipo: '', mensaje: '' });
  const [confirm, setConfirm] = useState({ open: false, title: '', message: '', onConfirm: null });

  // Guardar en LocalStorage (incluye el caso "lista vacia")
  useEffect(() => {
    localStorage.setItem('docentes', JSON.stringify(docentes));
  }, [docentes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nombre = (formData.nombre || '').trim();
    const especialidad = (formData.especialidad || '').trim();
    const correo = (formData.correo || '').trim();
    if (!nombre) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (!especialidad) {
      setError('La especialidad es obligatoria.');
      return;
    }
    if (!correo) {
      setError('El correo es obligatorio.');
      return;
    }
    // Evita duplicados de correo (practico para una escuela)
    const correoLower = correo.toLowerCase();
    const existeCorreo = docentes.some(d => (d.correo || '').toLowerCase() === correoLower && d.id !== formData.id);
    if (existeCorreo) {
      setError('Ya existe un docente con ese correo.');
      return;
    }

    if (isEditing) {
      const docentesActualizados = docentes.map((docente) =>
        docente.id === formData.id ? { ...formData, nombre, especialidad, correo } : docente
      );
      setDocentes(docentesActualizados);
      setIsEditing(false);
      setAviso({ tipo: 'success', mensaje: 'Docente actualizado.' });
    } else {
      const nuevoDocente = { ...formData, id: Date.now().toString(), nombre, especialidad, correo };
      setDocentes([...docentes, nuevoDocente]);
      setAviso({ tipo: 'success', mensaje: 'Docente registrado.' });
    }
    setFormData({ id: '', nombre: '', especialidad: '', correo: '' });
  };

  const handleEdit = (docente) => {
    setFormData(docente);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    // Regla de negocio: no borrar docentes asignados a clases.
    const clases = JSON.parse(localStorage.getItem('clases')) || [];
    const clasesAsignadas = clases.filter(c => c.docenteId === id);
    if (clasesAsignadas.length > 0) {
      setAviso({ tipo: 'warn', mensaje: `No se puede eliminar este docente porque está asignado a ${clasesAsignadas.length} clase(s). Reasigna esas clases primero.` });
      return;
    }

    setConfirm({
      open: true,
      title: 'Eliminar docente',
      message: '¿Estás seguro de eliminar a este docente?',
      onConfirm: () => {
        const docentesFiltrados = docentes.filter((docente) => docente.id !== id);
        setDocentes(docentesFiltrados);
        setAviso({ tipo: 'success', mensaje: 'Docente eliminado.' });
        setConfirm({ open: false, title: '', message: '', onConfirm: null });
      }
    });
  };

  return (
    <div className="docentes-container">
      <Aviso tipo={aviso.tipo} mensaje={aviso.mensaje} onClose={() => setAviso({ tipo: '', mensaje: '' })} />
      <ConfirmModal
        open={confirm.open}
        title={confirm.title}
        message={confirm.message}
        confirmText="Eliminar"
        cancelText="Cancelar"
        tone="danger"
        onCancel={() => setConfirm({ open: false, title: '', message: '', onConfirm: null })}
        onConfirm={() => confirm.onConfirm?.()}
      />
      {/* 2. Envolver el título y el botón en un div flex para alinearlos */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="docentes-titulo" style={{ margin: 0 }}>Gestión de Docentes</h2>
        <button 
          onClick={volverInicio} 
          className="btn btn-cancelar" 
          style={{ padding: '8px 15px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          ✖ Cerrar
        </button>
      </div>

      {/* Formulario */}
      <div className="docentes-card">
        <h3>{isEditing ? 'Editar Docente' : 'Agregar Nuevo Docente'}</h3>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="form-error" role="alert">{error}</div>
          )}
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
