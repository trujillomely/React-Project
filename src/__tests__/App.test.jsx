import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App.jsx';
import { EventsProvider } from '../context/EventsContext.jsx';

describe('preferencia de tema', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  test('cambia a modo oscuro y conserva la preferencia', () => {
    render(<MemoryRouter><EventsProvider><App /></EventsProvider></MemoryRouter>);

    fireEvent.click(screen.getByRole('button', { name: 'Activar modo oscuro' }));

    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('eventos-app:theme')).toBe('dark');
    expect(screen.getByRole('button', { name: 'Activar modo claro' })).toBeInTheDocument();
  });
});
