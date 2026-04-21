import React, { useState } from 'react';
import Docentes from './Componentes/Docentes';
import './Componentes/estilomenu.css';
import Alumnos from './Componentes/Alumnos';
import Clases from './Componentes/Clases';
import Inicio from './Componentes/Inicio';
import { GraduationCap, Users, BookOpen } from 'lucide-react';

function App() {
  // Estado para saber qué vista mostrar
  const [vistaActual, setVistaActual] = useState('inicio');

  return (
    <div className="App">
      {/* Menú de Navegación */}
      <nav className="navbar">
        <button 
          className={`nav-button ${vistaActual === 'inicio' ? 'active' : ''}`}
          onClick={() => setVistaActual('inicio')}
        >
          <span className="nav-icon" aria-hidden="true"><GraduationCap size={18} /></span>
          <span className="nav-text">Inicio</span>
        </button>
        <button 
          className={`nav-button ${vistaActual === 'docentes' ? 'active' : ''}`}
          onClick={() => setVistaActual('docentes')}
        >
          <span className="nav-icon" aria-hidden="true"><Users size={18} /></span>
          <span className="nav-text">Docentes</span>
        </button>
        <button 
          className={`nav-button ${vistaActual === 'clases' ? 'active' : ''}`}
          onClick={() => setVistaActual('clases')}
        >
          <span className="nav-icon" aria-hidden="true"><BookOpen size={18} /></span>
          <span className="nav-text">Clases</span>
        </button>
        <button 
          className={`nav-button ${vistaActual === 'alumnos' ? 'active' : ''}`}
          onClick={() => setVistaActual('alumnos')}
        >
          <span className="nav-icon" aria-hidden="true"><GraduationCap size={18} /></span>
          <span className="nav-text">Alumnos</span>
        </button>
      </nav>

      {/* Renderizado Condicional */}
      <main className="main-content">
          {vistaActual === 'inicio' && <Inicio irA={(vista) => setVistaActual(vista)} />}
          {vistaActual === 'docentes' && <Docentes volverInicio={() => setVistaActual('inicio')} />}
          {vistaActual === 'clases' && <Clases volverInicio={() => setVistaActual('inicio')} />}
          {vistaActual === 'alumnos' && <Alumnos volverInicio={() => setVistaActual('inicio')} />}
        </main>
    </div>
  );
}

export default App;
