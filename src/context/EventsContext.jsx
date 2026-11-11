import { createContext, useContext, useEffect, useReducer } from 'react';
import { eventsReducer, initialState } from './eventsReducer.js';

const STORAGE_KEY = 'eventos-app:v1';
const EventsContext = createContext(null);

function init(base) {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...base, events: saved.events || [], fired: saved.fired || [], snoozes: saved.snoozes || [] } : base;
  } catch {
    return base;
  }
}

export function EventsProvider({ children, initial = initialState }) {
  const [state, dispatch] = useReducer(eventsReducer, initial, init);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ events: state.events, fired: state.fired, snoozes: state.snoozes }));
    } catch {
      /* almacenamiento no disponible */
    }
  }, [state.events, state.fired, state.snoozes]);

  return <EventsContext.Provider value={{ state, dispatch }}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error('useEvents debe usarse dentro de <EventsProvider>');
  return ctx;
}
