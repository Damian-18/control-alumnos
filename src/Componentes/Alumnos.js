import React, { useState, useEffect } from 'react';
import './estiloalumno.css';

const Alumnos = ({ volverInicio }) => {
  // 1. INICIALIZACIÓN PEREZOSA: Leemos el LocalStorage directamente al crear el estado
  const [alumnos, setAlumnos] = useState(() => {
    const storedAlumnos = localStorage.getItem('alumnos');
    return storedAlumnos ? JSON.parse(storedAlumnos) : [];
  });

  const [clasesDisponibles] = useState(() => {
    const storedClases = localStorage.getItem('clases');
    return storedClases ? JSON.parse(storedClases) : [];
  });

  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    matricula: '',
    clasesInscritas: [] 
  });

  // Guardar en LocalStorage
  useEffect(() => {
    localStorage.setItem('alumnos', JSON.stringify(alumnos));
  }, [alumnos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar la selección múltiple de clases
  const handleClaseCheck = (claseId) => {
    const { clasesInscritas } = formData;
    if (clasesInscritas.includes(claseId)) {
      setFormData({
        ...formData,
        clasesInscritas: clasesInscritas.filter(id => id !== claseId)
      });
    } else {
      setFormData({
        ...formData,
        clasesInscritas: [...clasesInscritas, claseId]
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setAlumnos(alumnos.map(a => a.id === formData.id ? formData : a));
      setIsEditing(false);
    } else {
      const nuevoAlumno = { ...formData, id: Date.now().toString() };
      setAlumnos([...alumnos, nuevoAlumno]);
    }
    setFormData({ id: '', nombre: '', matricula: '', clasesInscritas: [] });
  };

  const handleEdit = (alumno) => {
    setFormData(alumno);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar registro de alumno?')) {
      setAlumnos(alumnos.filter(a => a.id !== id));
    }
  };

  // Función para obtener el nombre de la clase por su ID
  const getNombreClase = (id) => {
    const clase = clasesDisponibles.find(c => c.id === id);
    return clase ? clase.nombre : 'Clase no encontrada';
  };

  return (
    <div className="alumnos-container">
      {/* 2. Contenedor flex para título y botón */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="alumnos-titulo" style={{ margin: 0 }}>Gestión de Alumnos</h2>
        <button 
          onClick={volverInicio} 
          className="btn-cancelar" 
          style={{ 
            padding: '8px 15px', 
            fontSize: '14px',
            fontWeight: 'bold', 
            cursor: 'pointer',
            border: 'none', 
            borderRadius: '4px',
            height: 'fit-content',
            color: 'white'
          }}
        >
          ✖ Cerrar
        </button>
      </div>

      <div className="alumnos-card">
        <h3>{isEditing ? 'Modificar Alumno' : 'Registrar Alumno'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre del Alumno:</label>
            <input 
              className="form-input" 
              name="nombre" 
              value={formData.nombre} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Matrícula / ID Estudiantil:</label>
            <input 
              className="form-input" 
              name="matricula" 
              value={formData.matricula} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Asignar Clases:</label>
            <div className="clases-selector">
              {clasesDisponibles.length > 0 ? (
                clasesDisponibles.map(clase => (
                  <div key={clase.id} className="clase-item">
                    <input 
                      type="checkbox" 
                      id={`clase-${clase.id}`}
                      checked={formData.clasesInscritas.includes(clase.id)}
                      onChange={() => handleClaseCheck(clase.id)}
                    />
                    <label htmlFor={`clase-${clase.id}`} style={{marginLeft: '8px'}}>
                      {clase.nombre}
                    </label>
                  </div>
                ))
              ) : (
                <p style={{fontSize: '0.8rem', color: '#e74c3c'}}>
                  * No hay clases creadas. Ve al menú Clases primero.
                </p>
              )}
            </div>
          </div>

          <button type="submit" className={`btn-alumnos ${isEditing ? 'btn-actualizar' : 'btn-guardar'}`}>
            {isEditing ? 'Actualizar Datos' : 'Registrar Alumno'}
          </button>
          {isEditing && (
            <button type="button" className="btn-alumnos btn-cancelar" onClick={() => {
              setIsEditing(false);
              setFormData({ id: '', nombre: '', matricula: '', clasesInscritas: [] });
            }}>
              Cancelar
            </button>
          )}
        </form>
      </div>

      <div className="alumnos-card">
        <h3>Listado de Alumnos</h3>
        <table className="alumnos-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Matrícula</th>
              <th>Clases</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map(alumno => (
              <tr key={alumno.id}>
                <td>{alumno.nombre}</td>
                <td>{alumno.matricula}</td>
                <td>
                  {alumno.clasesInscritas.map(cId => (
                    <span key={cId} className="badge-clase">{getNombreClase(cId)}</span>
                  ))}
                </td>
                <td>
                  <button className="btn-editar" onClick={() => handleEdit(alumno)}>Editar</button>
                  <button className="btn-eliminar" onClick={() => handleDelete(alumno.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Alumnos;