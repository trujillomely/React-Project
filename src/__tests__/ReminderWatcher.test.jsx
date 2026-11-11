import { act, fireEvent, render, screen } from '@testing-library/react';
import ReminderWatcher from '../components/ReminderWatcher.jsx';
import Toasts from '../components/Toasts.jsx';
import { EventsProvider } from '../context/EventsContext.jsx';
import { initialState } from '../context/eventsReducer.js';

const renderWatcher = (events) => render(
  <EventsProvider initial={{ ...initialState, events }}>
    <ReminderWatcher />
    <Toasts />
  </EventsProvider>
);

describe('ReminderWatcher', () => {
  const originalNotification = global.Notification;

  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 10, 10, 10, 0, 0));
    global.Notification = jest.fn();
    global.Notification.permission = 'granted';
    global.Notification.requestPermission = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    if (originalNotification === undefined) delete global.Notification;
    else global.Notification = originalNotification;
  });

  test('muestra el aviso cuando llega el tiempo configurado y no lo repite', () => {
    renderWatcher([{ id: 'evento-1', title: 'Cita médica', date: '2026-11-10', time: '10:05', reminders: [5] }]);

    expect(screen.getByRole('status')).toHaveTextContent('Cita médica — 5 min antes');
    expect(global.Notification).toHaveBeenCalledTimes(1);
    expect(global.Notification).toHaveBeenCalledWith('Recordatorio', { body: 'Cita médica — 5 min antes' });

    act(() => jest.advanceTimersByTime(60000));
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(global.Notification).toHaveBeenCalledTimes(1);
  });

  test('revisa periódicamente y dispara el aviso al entrar en la ventana', () => {
    renderWatcher([{ id: 'evento-2', title: 'Reunión', date: '2026-11-10', time: '10:06', reminders: [5] }]);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    act(() => jest.advanceTimersByTime(60000));
    expect(screen.getByRole('status')).toHaveTextContent('Reunión — 5 min antes');
  });

  test('permite posponer un aviso cinco minutos', () => {
    renderWatcher([{ id: 'evento-3', title: 'Llamada', date: '2026-11-10', time: '10:05', reminders: [5] }]);
    fireEvent.click(screen.getByRole('button', { name: 'Posponer 5 min' }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    act(() => jest.advanceTimersByTime(5 * 60000));
    expect(screen.getByRole('status')).toHaveTextContent('Recordatorio pospuesto: Llamada');
  });

  test('repite las alertas con el intervalo configurado', () => {
    renderWatcher([{ id: 'evento-4', title: 'Presentación', date: '2026-11-10', time: '10:30', reminders: [30], repeatInterval: 10 }]);
    expect(screen.getByRole('status')).toHaveTextContent('te avisaré cada 10 min');

    act(() => jest.advanceTimersByTime(10 * 60000));
    expect(screen.getAllByRole('status')).toHaveLength(2);
    expect(screen.getAllByRole('status')[1]).toHaveTextContent('20 min antes');
  });
});
