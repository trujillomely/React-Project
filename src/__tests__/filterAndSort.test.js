import { filterAndSort } from '../utils/events.js';

const events = [
  { id: '1', title: 'Zeta', date: '2026-11-12', time: '10:00', category: 'trabajo', reminders: [] },
  { id: '2', title: 'Alfa', date: '2026-11-10', time: '09:00', category: 'personal', reminders: [] },
];

describe('filterAndSort', () => {
  test('ordena por fecha por defecto', () => {
    expect(filterAndSort(events).map((e) => e.id)).toEqual(['2', '1']);
  });
  test('ordena por título', () => {
    expect(filterAndSort(events, { sortBy: 'title' }).map((e) => e.title)).toEqual(['Alfa', 'Zeta']);
  });
  test('filtra por categoría y búsqueda', () => {
    expect(filterAndSort(events, { category: 'trabajo' })).toHaveLength(1);
    expect(filterAndSort(events, { search: 'alf' })[0].id).toBe('2');
  });
});
