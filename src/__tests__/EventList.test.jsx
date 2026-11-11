import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EventList from '../components/EventList.jsx';
import EventFilters from '../components/EventFilters.jsx';
import { EventsProvider } from '../context/EventsContext.jsx';
import { initialState } from '../context/eventsReducer.js';

const events = [
  { id: '1', title: 'Informe mensual', date: '2026-11-12', time: '10:00', category: 'trabajo', description: '', reminders: [30] },
  { id: '2', title: 'Cumpleaños', date: '2026-11-15', time: '18:00', category: 'personal', description: '', reminders: [] },
];

const setup = () =>
  render(
    <MemoryRouter>
      <EventsProvider initial={{ ...initialState, events }}>
        <EventFilters />
        <EventList />
      </EventsProvider>
    </MemoryRouter>
  );

describe('EventList', () => {
  beforeEach(() => localStorage.clear());

  test('muestra los eventos', () => {
    setup();
    expect(screen.getByText('Informe mensual')).toBeInTheDocument();
    expect(screen.getByText('Cumpleaños')).toBeInTheDocument();
  });

  test('filtra por categoría', () => {
    setup();
    fireEvent.change(screen.getByLabelText('Filtrar por categoría'), { target: { value: 'trabajo' } });
    expect(screen.queryByText('Cumpleaños')).not.toBeInTheDocument();
  });

  test('elimina un evento', () => {
    setup();
    fireEvent.click(screen.getByLabelText('Eliminar Cumpleaños'));
    expect(screen.queryByText('Cumpleaños')).not.toBeInTheDocument();
  });
});
