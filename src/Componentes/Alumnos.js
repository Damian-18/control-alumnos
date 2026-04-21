import React, { useState, useEffect } from 'react';
import './estiloalumno.css';
import './estiloavisos.css';
import Aviso from './Aviso';
import ConfirmModal from './ConfirmModal';

const Alumnos = ({ volverInicio }) => {
  // 1. INICIALIZACIÓN PEREZOSA: Leemos el LocalStorage directamente al crear el estado
  const [alumnos, setAlumnos] = useState(() => {
    const storedAlumnos = localStorage.getItem('alumnos');
    return storedAlumnos ? JSON.parse(storedAlumnos) : [];
  });

  const [clasesDisponibles, setClasesDisponibles] = useState(() => {
    const storedClases = localStorage.getItem('clases');
    return storedClases ? JSON.parse(storedClases) : [];
  });

  const [docentesDisponibles, setDocentesDisponibles] = useState(() => {
    const stored = localStorage.getItem('docentes');
    return stored ? JSON.parse(stored) : [];
  });

  const [asistencias, setAsistencias] = useState(() => {
    const stored = localStorage.getItem('asistencias');
    return stored ? JSON.parse(stored) : [];
  });

  const [calificaciones, setCalificaciones] = useState(() => {
    const stored = localStorage.getItem('calificaciones');
    return stored ? JSON.parse(stored) : [];
  });

  const [isEditing, setIsEditing] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState({ tipo: '', mensaje: '' });
  const [confirm, setConfirm] = useState({ open: false, title: '', message: '', onConfirm: null });

  const [alumnoDetalleId, setAlumnoDetalleId] = useState('');
  
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

  // Refresca clases disponibles cuando vuelves a esta pestaña.
  useEffect(() => {
    const onFocus = () => {
      const storedClases = localStorage.getItem('clases');
      setClasesDisponibles(storedClases ? JSON.parse(storedClases) : []);

      const storedDocentes = localStorage.getItem('docentes');
      setDocentesDisponibles(storedDocentes ? JSON.parse(storedDocentes) : []);

      const storedAsistencias = localStorage.getItem('asistencias');
      setAsistencias(storedAsistencias ? JSON.parse(storedAsistencias) : []);

      const storedCalificaciones = localStorage.getItem('calificaciones');
      setCalificaciones(storedCalificaciones ? JSON.parse(storedCalificaciones) : []);
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  // Limpiar error cuando el usuario escribe
  useEffect(() => {
    if (error) setError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.nombre, formData.matricula, formData.clasesInscritas]);

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

    const nombre = (formData.nombre || '').trim();
    const matricula = (formData.matricula || '').trim();
    if (!nombre) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (!matricula) {
      setError('La matrícula es obligatoria.');
      return;
    }
    // Matricula única
    const matriculaLower = matricula.toLowerCase();
    const existeMatricula = alumnos.some(a => (a.matricula || '').toLowerCase() === matriculaLower && a.id !== formData.id);
    if (existeMatricula) {
      setError('Ya existe un alumno con esa matrícula.');
      return;
    }

    if (isEditing) {
      setAlumnos(alumnos.map(a => a.id === formData.id ? { ...formData, nombre, matricula } : a));
      setIsEditing(false);
      setAviso({ tipo: 'success', mensaje: 'Alumno actualizado.' });
    } else {
      const nuevoAlumno = { ...formData, id: Date.now().toString(), nombre, matricula };
      setAlumnos([...alumnos, nuevoAlumno]);
      setAviso({ tipo: 'success', mensaje: 'Alumno registrado.' });
    }
    setFormData({ id: '', nombre: '', matricula: '', clasesInscritas: [] });
  };

  const handleEdit = (alumno) => {
    setFormData(alumno);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setConfirm({
      open: true,
      title: 'Eliminar alumno',
      message: '¿Eliminar registro de alumno?',
      onConfirm: () => {
        setAlumnos(alumnos.filter(a => a.id !== id));
        if (alumnoDetalleId === id) setAlumnoDetalleId('');
        setAviso({ tipo: 'success', mensaje: 'Alumno eliminado.' });
        setConfirm({ open: false, title: '', message: '', onConfirm: null });
      }
    });
  };

  // Función para obtener el nombre de la clase por su ID
  const getNombreClase = (id) => {
    const clase = clasesDisponibles.find(c => c.id === id);
    return clase ? clase.nombre : 'Clase no encontrada';
  };

  const getClase = (id) => clasesDisponibles.find(c => c.id === id);
  const getDocente = (id) => docentesDisponibles.find(d => d.id === id);
  const getNombreDocente = (id) => {
    const d = getDocente(id);
    return d ? d.nombre : 'Docente no encontrado/eliminado';
  };

  const alumnoDetalle = alumnos.find(a => a.id === alumnoDetalleId);
  const clasesAlumno = (alumnoDetalle?.clasesInscritas || [])
    .map(cid => getClase(cid))
    .filter(Boolean);

  const asistenciasAlumno = alumnoDetalle
    ? asistencias.filter(r => r.alumnoId === alumnoDetalle.id)
    : [];

  const calificacionesAlumno = alumnoDetalle
    ? calificaciones.filter(r => r.alumnoId === alumnoDetalle.id)
    : [];

  const resumenAsistenciasPorClase = (claseId) => {
    const registros = asistenciasAlumno.filter(r => r.claseId === claseId);
    const total = registros.length;
    const conteo = { presente: 0, ausente: 0, retardo: 0, justificado: 0 };
    for (const r of registros) {
      const k = (r.estatus || '').toLowerCase();
      if (k in conteo) conteo[k] += 1;
    }
    return { total, ...conteo };
  };

  const calificacionesPorClase = (claseId) => {
    const registros = calificacionesAlumno
      .filter(r => r.claseId === claseId)
      .slice()
      .sort((a, b) => String(a.unidad || '').localeCompare(String(b.unidad || '')));

    const nums = registros.map(r => r.valor).filter(v => typeof v === 'number' && !Number.isNaN(v));
    const promedio = nums.length ? (nums.reduce((acc, n) => acc + n, 0) / nums.length) : null;
    return { registros, promedio };
  };

  const normalizar = (s) => (s || '').toString().trim().toLowerCase();
  const alumnosFiltrados = alumnos.filter(a => {
    const q = normalizar(busqueda);
    if (!q) return true;
    return normalizar(a.nombre).includes(q) || normalizar(a.matricula).includes(q);
  });

  return (
    <div className="alumnos-container">
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
          {error && (
            <div className="form-error" role="alert">{error}</div>
          )}
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
        <div className="buscador-row">
          <input
            className="form-input"
            placeholder="Buscar por nombre o matrícula..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button
            type="button"
            className="btn-limpiar"
            onClick={() => setBusqueda('')}
            disabled={!busqueda.trim()}
            title="Limpiar búsqueda"
          >
            Limpiar
          </button>
        </div>
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
            {alumnosFiltrados.map(alumno => (
              <tr key={alumno.id}>
                <td>{alumno.nombre}</td>
                <td>{alumno.matricula}</td>
                <td>
                  {alumno.clasesInscritas.map(cId => (
                    <span key={cId} className="badge-clase">{getNombreClase(cId)}</span>
                  ))}
                </td>
                <td>
                  <button className="btn-ver" onClick={() => setAlumnoDetalleId(alumno.id)}>Ver</button>
                  <button className="btn-editar" onClick={() => handleEdit(alumno)}>Editar</button>
                  <button className="btn-eliminar" onClick={() => handleDelete(alumno.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {alumnos.length > 0 && alumnosFiltrados.length === 0 && (
          <p className="empty-hint">No hay resultados para la búsqueda.</p>
        )}
      </div>

      {alumnoDetalle && (
        <div className="alumnos-card">
          <div className="detalle-header">
            <h3 style={{ margin: 0 }}>Detalle de Alumno</h3>
            <button type="button" className="btn-cerrar-detalle" onClick={() => setAlumnoDetalleId('')}>
              Cerrar
            </button>
          </div>

          <div className="detalle-identidad">
            <div><strong>Nombre:</strong> {alumnoDetalle.nombre}</div>
            <div><strong>Matrícula:</strong> {alumnoDetalle.matricula}</div>
          </div>

          {clasesAlumno.length === 0 ? (
            <p className="empty-hint">Este alumno aún no está inscrito en clases.</p>
          ) : (
            <div className="detalle-grid">
              {clasesAlumno.map(clase => {
                const asis = resumenAsistenciasPorClase(clase.id);
                const cal = calificacionesPorClase(clase.id);
                return (
                  <div key={clase.id} className="detalle-card">
                    <div className="detalle-card-title">
                      <div className="detalle-clase">{clase.nombre}</div>
                      <div className="detalle-docente">{getNombreDocente(clase.docenteId)}</div>
                    </div>

                    <div className="detalle-seccion">
                      <div className="detalle-seccion-titulo">Asistencias</div>
                      <div className="detalle-metricas">
                        <div><strong>Total:</strong> {asis.total}</div>
                        <div><strong>Presente:</strong> {asis.presente}</div>
                        <div><strong>Ausente:</strong> {asis.ausente}</div>
                        <div><strong>Retardo:</strong> {asis.retardo}</div>
                        <div><strong>Justificado:</strong> {asis.justificado}</div>
                      </div>
                    </div>

                    <div className="detalle-seccion">
                      <div className="detalle-seccion-titulo">Calificaciones</div>
                      <div className="detalle-metricas">
                        <div>
                          <strong>Promedio:</strong>{' '}
                          {cal.promedio === null ? 'Sin capturar' : cal.promedio.toFixed(2)}
                        </div>
                      </div>
                      {cal.registros.length === 0 ? (
                        <div className="empty-hint" style={{ marginTop: '8px' }}>No hay calificaciones registradas.</div>
                      ) : (
                        <table className="detalle-table">
                          <thead>
                            <tr>
                              <th>Unidad</th>
                              <th>Valor</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cal.registros.map(r => (
                              <tr key={r.id}>
                                <td>{r.unidad}</td>
                                <td>{typeof r.valor === 'number' ? r.valor : '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Alumnos;
