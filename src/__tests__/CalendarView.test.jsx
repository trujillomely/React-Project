import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CalendarView from '../components/CalendarView.jsx';
import { EventsProvider } from '../context/EventsContext.jsx';
import { initialState } from '../context/eventsReducer.js';

const events = [{ id: '1', title: 'Taller de React', date: '2026-11-12', time: '14:00', category: 'trabajo', reminders: [] }];

const setup = () =>
  render(
    <MemoryRouter>
      <EventsProvider initial={{ ...initialState, events }}>
        <CalendarView initialDate={new Date(2026, 10, 10)} />
      </EventsProvider>
    </MemoryRouter>
  );

describe('CalendarView', () => {
  beforeEach(() => localStorage.clear());

  test('muestra el mes y el evento en su día', () => {
    setup();
    expect(screen.getByTestId('month-title')).toHaveTextContent(/noviembre 2026/i);
    expect(screen.getByText('Taller de React')).toBeInTheDocument();
  });

  test('cambia de mes', () => {
    setup();
    fireEvent.click(screen.getByLabelText('Mes siguiente'));
    expect(screen.getByTestId('month-title')).toHaveTextContent(/diciembre 2026/i);
  });

  test('al seleccionar un día muestra sus eventos', () => {
    setup();
    fireEvent.click(screen.getByLabelText('2026-11-12'));
    const agenda = within(screen.getByLabelText('Agenda del día'));
    expect(agenda.getByText('14:00')).toBeInTheDocument();
    expect(agenda.getByText('Taller de React')).toBeInTheDocument();
    expect(screen.getByLabelText('Vista diaria')).toBeInTheDocument();
  });

  test('al hacer clic en un evento abre sus detalles', () => {
    setup();
    fireEvent.click(screen.getByLabelText('2026-11-12'));
    fireEvent.click(screen.getByRole('button', { name: /ver detalles/i }));
    expect(screen.getByRole('dialog')).toHaveTextContent('Taller de React');
    expect(screen.getByRole('link', { name: 'Editar evento' })).toHaveAttribute('href', '/editar/1');
  });

  test('el botón Eliminar borra el evento y cierra sus detalles', () => {
    setup();
    fireEvent.click(screen.getByLabelText('2026-11-12'));
    fireEvent.click(screen.getByRole('button', { name: /ver detalles/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /ver detalles/i })).not.toBeInTheDocument();
    expect(screen.getByText('No hay planes para este día.')).toBeInTheDocument();
  });
});
