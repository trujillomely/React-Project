import { useEffect } from 'react';
import { useEvents } from '../context/EventsContext.jsx';
import { eventStart, reminderLabel } from '../utils/events.js';

const CHECK_EVERY_MS = 15000;

// Revisa periódicamente si algún recordatorio ya debe dispararse.
export default function ReminderWatcher() {
  const { state, dispatch } = useEvents();

  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Promise.resolve(Notification.requestPermission()).catch(() => {
        // El aviso dentro de la app sigue funcionando si el navegador no concede permiso.
      });
    }
  }, []);

  useEffect(() => {
    const check = () => {
      const now = Date.now();
      state.events.forEach((e) => {
        const start = eventStart(e).getTime();
        (e.reminders || []).forEach((min) => {
          const interval = Math.max(0, Number(e.repeatInterval) || 0) * 60000;
          const firstDue = start - min * 60000;
          if (now < firstDue || now > start) return;
          const occurrence = interval ? Math.floor((now - firstDue) / interval) : 0;
          const key = interval ? `${e.id}|${min}|${occurrence}` : `${e.id}|${min}`;
          if (state.fired.includes(key)) return;
          if (interval && occurrence === 0 && state.fired.includes(`${e.id}|${min}`)) return;
          const minutesUntilStart = Math.max(0, Math.ceil((start - now) / 60000));
          const message = `${e.title} — ${reminderLabel(minutesUntilStart)}${interval ? ` · te avisaré cada ${e.repeatInterval} min` : ''}`;
          dispatch({ type: 'REMINDER_FIRED', payload: { key, eventId: e.id, message } });
          if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            new Notification('Recordatorio', { body: message });
          }
        });
      });
      (state.snoozes || []).forEach((snooze) => {
        const event = state.events.find((item) => item.id === snooze.eventId);
        if (!event || now < snooze.due || now > eventStart(event).getTime() || state.fired.includes(snooze.id)) return;
        const message = `Recordatorio pospuesto: ${snooze.title}`;
        dispatch({ type: 'REMINDER_FIRED', payload: { key: snooze.id, eventId: snooze.eventId, message } });
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          new Notification('Recordatorio pospuesto', { body: message });
        }
      });
    };
    check();
    const id = setInterval(check, CHECK_EVERY_MS);
    return () => clearInterval(id);
  }, [state.events, state.fired, state.snoozes, dispatch]);

  return null;
}
