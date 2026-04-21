import { render, screen } from '@testing-library/react';
import App from './App';

test('renderiza menu y panel de inicio', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /inicio/i })).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /docentes/i })[0]).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /clases/i })[0]).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /alumnos/i })[0]).toBeInTheDocument();
  expect(screen.getByText(/panel de inicio/i)).toBeInTheDocument();
});
