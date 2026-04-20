import React, { useState } from 'react';
import Docentes from './Componentes/Docentes';
import './Componentes/estilomenu.css';
import Alumnos from './Componentes/Alumnos';
import Clases from './Componentes/Clases';
import Inicio from './Componentes/Inicio';

function App() {
  // Estado para saber qué vista mostrar
  const [vistaActual, setVistaActual] = useState('inicio');

  return (
    <div className="App">
      {/* Menú de Navegación */}
      <nav className="navbar">
        <button 
          className={`nav-button ${vistaActual === 'docentes' ? 'active' : ''}`}
          onClick={() => setVistaActual('docentes')}
        >
          Docentes
        </button>
        <button 
          className={`nav-button ${vistaActual === 'clases' ? 'active' : ''}`}
          onClick={() => setVistaActual('clases')}
        >
          Clases
        </button>
        <button 
          className={`nav-button ${vistaActual === 'alumnos' ? 'active' : ''}`}
          onClick={() => setVistaActual('alumnos')}
        >
          Alumnos
        </button>
      </nav>

      {/* Renderizado Condicional */}
      <main>
        {vistaActual === 'inicio' && <Inicio />}
        {vistaActual === 'docentes' && <Docentes volverInicio={() => setVistaActual('inicio')} />}
        {vistaActual === 'clases' && <Clases volverInicio={() => setVistaActual('inicio')} />}
        {vistaActual === 'alumnos' && <Alumnos volverInicio={() => setVistaActual('inicio')} />}
      </main>
    </div>
  );
}

export default App;