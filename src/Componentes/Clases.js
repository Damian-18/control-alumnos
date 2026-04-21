import React, { useState, useEffect } from 'react';
import './estiloclases.css';
import './estiloavisos.css';
import Aviso from './Aviso';
import ConfirmModal from './ConfirmModal';

const Clases = ({ volverInicio }) => {
  // 1. Estado de Clases (con inicialización perezosa)
  const [clases, setClases] = useState(() => {
    const storedClases = localStorage.getItem('clases');
    return storedClases ? JSON.parse(storedClases) : [];
  });
  
  // 2. Estado para leer los docentes disponibles
  const [docentesDisponibles, setDocentesDisponibles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState({ tipo: '', mensaje: '' });
  const [confirm, setConfirm] = useState({ open: false, title: '', message: '', onConfirm: null });

  // Datos escolares (localStorage)
  const [alumnos, setAlumnos] = useState(() => {
    const stored = localStorage.getItem('alumnos');
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
  
  const [formData, setFormData] = useState({ 
    id: '', 
    nombre: '', 
    docenteId: '' // Aquí guardamos el ID del maestro, no su nombre
  });

  // Registro por clase
  const [claseSeleccionadaId, setClaseSeleccionadaId] = useState('');
  const [fechaAsistencia, setFechaAsistencia] = useState(() => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [asistenciaDraft, setAsistenciaDraft] = useState({});

  const [unidad, setUnidad] = useState('1');
  const [calificacionDraft, setCalificacionDraft] = useState({});

  // Cargar docentes al montar el componente
  useEffect(() => {
    const storedDocentes = JSON.parse(localStorage.getItem('docentes')) || [];
    setDocentesDisponibles(storedDocentes);
  }, []);

  // Si se agregan/eliminen docentes en otra vista, actualiza al volver a Clases.
  useEffect(() => {
    const onFocus = () => {
      const storedDocentes = JSON.parse(localStorage.getItem('docentes')) || [];
      setDocentesDisponibles(storedDocentes);

      const storedAlumnos = JSON.parse(localStorage.getItem('alumnos')) || [];
      setAlumnos(storedAlumnos);
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  // Guardar clases automáticamente cuando cambien
  useEffect(() => {
    localStorage.setItem('clases', JSON.stringify(clases));
  }, [clases]);

  useEffect(() => {
    localStorage.setItem('asistencias', JSON.stringify(asistencias));
  }, [asistencias]);

  useEffect(() => {
    localStorage.setItem('calificaciones', JSON.stringify(calificaciones));
  }, [calificaciones]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nombre = (formData.nombre || '').trim();
    const docenteId = (formData.docenteId || '').trim();
    if (!nombre) {
      setError('El nombre de la clase es obligatorio.');
      return;
    }
    if (!docenteId) {
      setError('Debes asignar un docente.');
      return;
    }

    if (isEditing) {
      setClases(clases.map((clase) => clase.id === formData.id ? { ...formData, nombre, docenteId } : clase));
      setIsEditing(false);
    } else {
      const nuevaClase = { ...formData, id: Date.now().toString(), nombre, docenteId };
      setClases([...clases, nuevaClase]);
    }
    setFormData({ id: '', nombre: '', docenteId: '' });
  };

  const handleEdit = (clase) => {
    setFormData(clase);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    const alumnos = JSON.parse(localStorage.getItem('alumnos')) || [];
    const alumnosInscritos = alumnos.filter(a => Array.isArray(a.clasesInscritas) && a.clasesInscritas.includes(id));
    if (alumnosInscritos.length > 0) {
      setAviso({ tipo: 'warn', mensaje: `No se puede eliminar esta clase porque hay ${alumnosInscritos.length} alumno(s) inscrito(s). Primero desinscríbelos o edita sus clases.` });
      return;
    }

    const asistenciasGuardadas = JSON.parse(localStorage.getItem('asistencias')) || [];
    const calificacionesGuardadas = JSON.parse(localStorage.getItem('calificaciones')) || [];
    const tieneAsistencias = asistenciasGuardadas.some(r => r.claseId === id);
    const tieneCalificaciones = calificacionesGuardadas.some(r => r.claseId === id);
    if (tieneAsistencias || tieneCalificaciones) {
      setAviso({ tipo: 'warn', mensaje: 'No se puede eliminar esta clase porque ya tiene registros de asistencia y/o calificaciones.' });
      return;
    }

    setConfirm({
      open: true,
      title: 'Eliminar clase',
      message: '¿Estás seguro de eliminar esta clase?',
      onConfirm: () => {
        setClases(clases.filter((clase) => clase.id !== id));
        setAviso({ tipo: 'success', mensaje: 'Clase eliminada.' });
        setConfirm({ open: false, title: '', message: '', onConfirm: null });
      }
    });
  };

  // Helper para mostrar el nombre del maestro en la tabla
  const getNombreDocente = (id) => {
    const docente = docentesDisponibles.find(d => d.id === id);
    return docente ? docente.nombre : 'Docente no encontrado/eliminado';
  };

  const alumnosDeClase = alumnos.filter(a => Array.isArray(a.clasesInscritas) && a.clasesInscritas.includes(claseSeleccionadaId));

  const getAsistencia = (claseId, alumnoId, fechaISO) => {
    return asistencias.find(r => r.claseId === claseId && r.alumnoId === alumnoId && r.fechaISO === fechaISO);
  };

  const getCalificacion = (claseId, alumnoId, unidadKey) => {
    return calificaciones.find(r => r.claseId === claseId && r.alumnoId === alumnoId && r.unidad === unidadKey);
  };

  // Prefill de drafts al cambiar clase/fecha/unidad
  useEffect(() => {
    if (!claseSeleccionadaId) return;
    const next = {};
    for (const a of alumnosDeClase) {
      const existente = getAsistencia(claseSeleccionadaId, a.id, fechaAsistencia);
      next[a.id] = existente?.estatus || 'presente';
    }
    setAsistenciaDraft(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claseSeleccionadaId, fechaAsistencia]);

  useEffect(() => {
    if (!claseSeleccionadaId) return;
    const unidadKey = (unidad || '').trim();
    if (!unidadKey) return;

    const next = {};
    for (const a of alumnosDeClase) {
      const existente = getCalificacion(claseSeleccionadaId, a.id, unidadKey);
      next[a.id] = typeof existente?.valor === 'number' ? String(existente.valor) : '';
    }
    setCalificacionDraft(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claseSeleccionadaId, unidad]);

  const guardarAsistencia = () => {
    if (!claseSeleccionadaId) {
      setAviso({ tipo: 'warn', mensaje: 'Selecciona una clase.' });
      return;
    }
    if (!fechaAsistencia) {
      setAviso({ tipo: 'warn', mensaje: 'Selecciona una fecha.' });
      return;
    }

    const nuevos = [...asistencias];
    for (const a of alumnosDeClase) {
      const estatus = (asistenciaDraft[a.id] || 'presente').toLowerCase();
      const idx = nuevos.findIndex(r => r.claseId === claseSeleccionadaId && r.alumnoId === a.id && r.fechaISO === fechaAsistencia);
      const registro = {
        id: `${claseSeleccionadaId}-${a.id}-${fechaAsistencia}`,
        claseId: claseSeleccionadaId,
        alumnoId: a.id,
        fechaISO: fechaAsistencia,
        estatus
      };
      if (idx >= 0) nuevos[idx] = registro;
      else nuevos.push(registro);
    }
    setAsistencias(nuevos);
    setAviso({ tipo: 'success', mensaje: 'Asistencia guardada.' });
  };

  const guardarCalificaciones = () => {
    if (!claseSeleccionadaId) {
      setAviso({ tipo: 'warn', mensaje: 'Selecciona una clase.' });
      return;
    }
    const unidadKey = (unidad || '').trim();
    if (!unidadKey) {
      setAviso({ tipo: 'warn', mensaje: 'Escribe una unidad (ej. 1, 2, Parcial 1).' });
      return;
    }

    const nuevos = [...calificaciones];
    for (const a of alumnosDeClase) {
      const raw = (calificacionDraft[a.id] || '').trim();
      if (!raw) continue; // permite dejar en blanco

      const valor = Number(raw);
      if (Number.isNaN(valor) || valor < 0 || valor > 10) {
        setAviso({ tipo: 'error', mensaje: `Calificacion invalida para ${a.nombre}. Debe ser un numero entre 0 y 10.` });
        return;
      }

      const idx = nuevos.findIndex(r => r.claseId === claseSeleccionadaId && r.alumnoId === a.id && r.unidad === unidadKey);
      const registro = {
        id: `${claseSeleccionadaId}-${a.id}-${unidadKey}`,
        claseId: claseSeleccionadaId,
        alumnoId: a.id,
        unidad: unidadKey,
        valor
      };
      if (idx >= 0) nuevos[idx] = registro;
      else nuevos.push(registro);
    }
    setCalificaciones(nuevos);
    setAviso({ tipo: 'success', mensaje: 'Calificaciones guardadas.' });
  };

  return (
    <div className="clases-container">
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
          {error && (
            <div className="form-error" role="alert">{error}</div>
          )}
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

      {/* Registro escolar por clase */}
      <div className="clases-card">
        <h3>Registro por Clase</h3>
        <div className="registro-toolbar">
          <div className="registro-field">
            <label className="form-label">Clase:</label>
            <select
              value={claseSeleccionadaId}
              onChange={(e) => setClaseSeleccionadaId(e.target.value)}
              className="form-input"
            >
              <option value="">Seleccione una clase...</option>
              {clases.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nombre} ({getNombreDocente(c.docenteId)})
                </option>
              ))}
            </select>
          </div>

          <div className="registro-field">
            <label className="form-label">Fecha (asistencia):</label>
            <input
              type="date"
              className="form-input"
              value={fechaAsistencia}
              onChange={(e) => setFechaAsistencia(e.target.value)}
              disabled={!claseSeleccionadaId}
            />
          </div>

          <div className="registro-field">
            <label className="form-label">Unidad (calificacion):</label>
            <input
              className="form-input"
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              placeholder="Ej. 1, 2, Parcial 1"
              disabled={!claseSeleccionadaId}
            />
          </div>
        </div>

        {!claseSeleccionadaId ? (
          <p>Selecciona una clase para capturar asistencia y calificaciones.</p>
        ) : alumnosDeClase.length === 0 ? (
          <p>No hay alumnos inscritos en esta clase. Inscríbelos desde la vista Alumnos.</p>
        ) : (
          <>
            <h4 className="registro-subtitulo">Asistencia</h4>
            <table className="clases-table">
              <thead>
                <tr>
                  <th>Alumno</th>
                  <th>Matrícula</th>
                  <th>Estatus</th>
                </tr>
              </thead>
              <tbody>
                {alumnosDeClase.map(a => (
                  <tr key={`asis-${a.id}`}>
                    <td>{a.nombre}</td>
                    <td>{a.matricula}</td>
                    <td>
                      <select
                        className="registro-select"
                        value={asistenciaDraft[a.id] || 'presente'}
                        onChange={(e) => setAsistenciaDraft({ ...asistenciaDraft, [a.id]: e.target.value })}
                      >
                        <option value="presente">Presente</option>
                        <option value="ausente">Ausente</option>
                        <option value="retardo">Retardo</option>
                        <option value="justificado">Justificado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className="btn btn-guardar" onClick={guardarAsistencia}>
              Guardar Asistencia
            </button>

            <h4 className="registro-subtitulo" style={{ marginTop: '18px' }}>Calificaciones</h4>
            <table className="clases-table">
              <thead>
                <tr>
                  <th>Alumno</th>
                  <th>Matrícula</th>
                  <th>Calificación (0-10)</th>
                </tr>
              </thead>
              <tbody>
                {alumnosDeClase.map(a => (
                  <tr key={`cal-${a.id}`}>
                    <td>{a.nombre}</td>
                    <td>{a.matricula}</td>
                    <td>
                      <input
                        type="number"
                        className="registro-input"
                        min="0"
                        max="10"
                        step="0.1"
                        value={calificacionDraft[a.id] ?? ''}
                        onChange={(e) => setCalificacionDraft({ ...calificacionDraft, [a.id]: e.target.value })}
                        placeholder="Ej. 8.5"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className="btn btn-guardar" onClick={guardarCalificaciones}>
              Guardar Calificaciones
            </button>
            <p className="registro-hint">Tip: puedes dejar calificaciones en blanco y capturarlas despues.</p>
          </>
        )}
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
