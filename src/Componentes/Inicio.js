import React, { useState, useEffect } from 'react';
import './estiloinicio.css';
import Logo from './Logo';

const Inicio = ({ irA }) => {
  const [totales, setTotales] = useState({
    alumnos: 0,
    docentes: 0,
    clases: 0
  });

  // Cargar los totales desde el LocalStorage al montar el componente
  useEffect(() => {
    const actualizar = () => {
      const storedAlumnos = JSON.parse(localStorage.getItem('alumnos')) || [];
      const storedDocentes = JSON.parse(localStorage.getItem('docentes')) || [];
      const storedClases = JSON.parse(localStorage.getItem('clases')) || [];

      setTotales({
        alumnos: storedAlumnos.length,
        docentes: storedDocentes.length,
        clases: storedClases.length
      });
    };

    actualizar();
    window.addEventListener('focus', actualizar);
    return () => window.removeEventListener('focus', actualizar);
  }, []);

  return (
    <div className="inicio-container">
      <h2 className="inicio-titulo">Panel de Inicio</h2>

      <div className="inicio-card bienvenida-card">
        <h3>¡Bienvenido al Sistema de Gestión!</h3>
        <p>Selecciona una opción en el menú superior para administrar los registros de la institución.</p>
      </div>

      <div className="inicio-stats-grid">
        <button
          type="button"
          className="inicio-card stat-card stat-card-button"
          onClick={() => irA?.('docentes')}
          title="Ir a Docentes"
        >
          <h4>👨‍🏫 Docentes Registrados</h4>
          <span className="stat-number">{totales.docentes}</span>
        </button>

        <button
          type="button"
          className="inicio-card stat-card stat-card-button"
          onClick={() => irA?.('clases')}
          title="Ir a Clases"
        >
          <h4>📚 Clases Disponibles</h4>
          <span className="stat-number">{totales.clases}</span>
        </button>

        <button
          type="button"
          className="inicio-card stat-card stat-card-button"
          onClick={() => irA?.('alumnos')}
          title="Ir a Alumnos"
        >
          <h4>🎓 Alumnos Inscritos</h4>
          <span className="stat-number">{totales.alumnos}</span>
        </button>
      </div>

      <div className="inicio-brand">
        <div className="inicio-brand-logo"><Logo title="Instituto San Miguel" /></div>
        <div className="inicio-brand-text">
          <div className="inicio-brand-name">Instituto San Miguel</div>
          <div className="inicio-brand-subtitle">Control Escolar</div>
        </div>
      </div>

      <footer className="inicio-footer">
        <div className="footer-top">
          <div className="footer-left">
            <div className="footer-title">Instituto San Miguel</div>
            <div className="footer-subtitle">Control Escolar v1.0</div>
          </div>
          <div className="footer-right">© {new Date().getFullYear()}</div>
        </div>
        <div className="footer-note">
          Nota: Los datos se guardan solo en este navegador (localStorage). Si borras los datos del navegador, se perderan los registros.
        </div>
      </footer>
    </div>
  );
};

export default Inicio;
