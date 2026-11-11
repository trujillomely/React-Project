// Modelo de evento:
// { id, title, description, date: 'yyyy-MM-dd', time: 'HH:mm', category, reminders: [minutosAntes, ...] }

export const eventStart = (e) => new Date(`${e.date}T${e.time || '00:00'}`);

export function filterAndSort(events, { category = 'all', search = '', sortBy = 'date' } = {}) {
  const q = search.trim().toLowerCase();
  const result = events.filter(
    (e) =>
      (category === 'all' || e.category === category) &&
      (!q || e.title.toLowerCase().includes(q) || (e.description || '').toLowerCase().includes(q))
  );
  return result.sort((a, b) =>
    sortBy === 'title' ? a.title.localeCompare(b.title) : eventStart(a) - eventStart(b)
  );
}

export const reminderLabel = (min) =>
  min >= 1440 && min % 1440 === 0
    ? `${min / 1440} día(s) antes`
    : min >= 60 && min % 60 === 0
    ? `${min / 60} h antes`
    : `${min} min antes`;
