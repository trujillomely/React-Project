# Gestor de Eventos y Recordatorios

React + Vite · React Router · Context + useReducer · Tailwind CSS · Jest + React Testing Library

## Uso
```bash
npm install
npm run dev     # desarrollo
npm test        # pruebas unitarias
npm run build   # producción
```

## Estructura
- `src/context/` — reducer y Context (estado global, persistido en localStorage)
- `src/components/` — EventForm, EventList, EventFilters, CalendarView, ReminderWatcher, Toasts
- `src/pages/` — vistas de las rutas (`/`, `/calendario`, `/nuevo`, `/editar/:id`)
- `src/utils/` — filtrado/ordenación y constantes (categorías)
- `src/__tests__/` — pruebas
