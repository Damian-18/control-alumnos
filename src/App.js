import React, { useState } from 'react';
import Docentes from './Componentes/Docentes';
import './Componentes/estilomenu.css';
import Alumnos from './Componentes/Alumnos';
import Clases from './Componentes/Clases';

function App() {
  // Estado para saber qué vista mostrar
  const [vistaActual, setVistaActual] = useState('docentes');

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
        {vistaActual === 'docentes' && <Docentes />}
        {vistaActual === 'clases' && <Clases />}
        {vistaActual === 'alumnos' && <Alumnos />}
      </main>
    </div>
  );
}

export default App;