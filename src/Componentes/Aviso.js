import React from 'react';

const tituloPorTipo = {
  info: 'Aviso',
  success: 'Listo',
  warn: 'Atencion',
  error: 'Error'
};

export default function Aviso({ tipo = 'info', mensaje, onClose }) {
  if (!mensaje) return null;

  const titulo = tituloPorTipo[tipo] || 'Aviso';
  return (
    <div className={`aviso aviso-${tipo}`} role="status" aria-live="polite">
      <div className="aviso-texto">
        <strong>{titulo}</strong>
        <div>{mensaje}</div>
      </div>
      <button type="button" className="aviso-cerrar" onClick={onClose} aria-label="Cerrar aviso">
        x
      </button>
    </div>
  );
}
