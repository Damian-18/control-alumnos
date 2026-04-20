import React, { useState, useEffect } from 'react';
import './estiloinicio.css';

const Inicio = () => {
  const [totales, setTotales] = useState({
    alumnos: 0,
    docentes: 0,
    clases: 0
  });

  // Cargar los totales desde el LocalStorage al montar el componente
  useEffect(() => {
    const storedAlumnos = JSON.parse(localStorage.getItem('alumnos')) || [];
    const storedDocentes = JSON.parse(localStorage.getItem('docentes')) || [];
    const storedClases = JSON.parse(localStorage.getItem('clases')) || [];

    setTotales({
      alumnos: storedAlumnos.length,
      docentes: storedDocentes.length,
      clases: storedClases.length
    });
  }, []);

  return (
    <div className="inicio-container">
      <h2 className="inicio-titulo">Panel de Inicio</h2>

      <div className="inicio-card bienvenida-card">
        <h3>¡Bienvenido al Sistema de Gestión!</h3>
        <p>Selecciona una opción en el menú superior para administrar los registros de la institución.</p>
      </div>

      <div className="inicio-stats-grid">
        <div className="inicio-card stat-card">
          <h4>👨‍🏫 Docentes Registrados</h4>
          <span className="stat-number">{totales.docentes}</span>
        </div>

        <div className="inicio-card stat-card">
          <h4>📚 Clases Disponibles</h4>
          <span className="stat-number">{totales.clases}</span>
        </div>

        <div className="inicio-card stat-card">
          <h4>🎓 Alumnos Inscritos</h4>
          <span className="stat-number">{totales.alumnos}</span>
        </div>
      </div>
    </div>
  );
};

export default Inicio;