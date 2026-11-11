import { eventsReducer, initialState } from '../context/eventsReducer.js';

const ev = { id: '1', title: 'Reunión', date: '2026-11-12', time: '10:00', category: 'reunion', reminders: [15] };

describe('eventsReducer', () => {
  test('agrega un evento', () => {
    const s = eventsReducer(initialState, { type: 'ADD_EVENT', payload: ev });
    expect(s.events).toHaveLength(1);
  });

  test('actualiza un evento y reinicia sus recordatorios disparados', () => {
    const base = { ...initialState, events: [ev], fired: ['1|15'] };
    const s = eventsReducer(base, { type: 'UPDATE_EVENT', payload: { id: '1', title: 'Nuevo título' } });
    expect(s.events[0].title).toBe('Nuevo título');
    expect(s.fired).toEqual([]);
  });

  test('elimina un evento', () => {
    const s = eventsReducer({ ...initialState, events: [ev] }, { type: 'DELETE_EVENT', payload: '1' });
    expect(s.events).toHaveLength(0);
  });

  test('dispara y descarta un recordatorio', () => {
    let s = eventsReducer(initialState, { type: 'REMINDER_FIRED', payload: { key: '1|15', message: 'Hola' } });
    expect(s.toasts).toHaveLength(1);
    s = eventsReducer(s, { type: 'DISMISS_TOAST', payload: '1|15' });
    expect(s.toasts).toHaveLength(0);
  });
});
