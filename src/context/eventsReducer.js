export const initialState = {
  events: [],
  fired: [], // claves "idEvento|minutos" de recordatorios ya disparados
  snoozes: [], // recordatorios pospuestos en espera
  toasts: [], // avisos visibles en pantalla
  filters: { category: 'all', search: '', sortBy: 'date' },
};

export function eventsReducer(state, action) {
  switch (action.type) {
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'UPDATE_EVENT':
      {
      const removedSnoozes = state.snoozes.filter((snooze) => snooze.eventId === action.payload.id);
      return {
        ...state,
        events: state.events.map((e) => (e.id === action.payload.id ? { ...e, ...action.payload } : e)),
        // al editar, los recordatorios de ese evento pueden volver a dispararse
        fired: state.fired.filter((k) => !k.startsWith(`${action.payload.id}|`) && !removedSnoozes.some((snooze) => snooze.id === k)),
        snoozes: state.snoozes.filter((snooze) => snooze.eventId !== action.payload.id),
      };
      }
    case 'DELETE_EVENT':
      {
      const removedSnoozes = state.snoozes.filter((snooze) => snooze.eventId === action.payload);
      return {
        ...state,
        events: state.events.filter((e) => e.id !== action.payload),
        fired: state.fired.filter((k) => !k.startsWith(`${action.payload}|`) && !removedSnoozes.some((snooze) => snooze.id === k)),
        snoozes: state.snoozes.filter((snooze) => snooze.eventId !== action.payload),
      };
      }
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'REMINDER_FIRED':
      return {
        ...state,
        fired: [...state.fired, action.payload.key],
        toasts: [...state.toasts, { id: action.payload.key, eventId: action.payload.eventId, message: action.payload.message }],
      };
    case 'SNOOZE_TOAST': {
      const toast = state.toasts.find((item) => item.id === action.payload);
      if (!toast) return state;
      const event = state.events.find((item) => item.id === toast.eventId);
      const untilEvent = event ? new Date(`${event.date}T${event.time || '00:00'}`).getTime() - Date.now() : 0;
      const delay = Math.max(0, Math.min(5 * 60 * 1000, untilEvent));
      const snoozes = delay > 0
        ? [...state.snoozes, { id: `snooze:${toast.id}:${Date.now()}`, eventId: toast.eventId, due: Date.now() + delay, title: event.title }]
        : state.snoozes;
      return { ...state, snoozes, toasts: state.toasts.filter((item) => item.id !== toast.id) };
    }
    case 'DISMISS_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };
    default:
      return state;
  }
}
