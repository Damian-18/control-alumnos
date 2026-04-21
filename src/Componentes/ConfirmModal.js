import React, { useEffect } from 'react';

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  tone = 'danger',
  onConfirm,
  onCancel
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onCancel?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  const confirmClass = tone === 'primary' ? 'modal-btn modal-btn-primary' : 'modal-btn modal-btn-danger';

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title || 'Confirmacion'} onMouseDown={onCancel}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        {title && <h4>{title}</h4>}
        {message && <p>{message}</p>}
        <div className="modal-actions">
          <button type="button" className="modal-btn" onClick={onCancel}>
            {cancelText}
          </button>
          <button type="button" className={confirmClass} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
