import { useEvents } from '../context/EventsContext.jsx';

export default function Toasts() {
  const { state, dispatch } = useEvents();
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 space-y-2 sm:left-auto sm:w-full sm:max-w-lg">
      {state.toasts.map((t) => (
        <div key={t.id} role="status" className="flex items-center justify-between gap-3 rounded-2xl bg-amber-500 px-4 py-3 text-white shadow-lg">
          <span className="min-w-0 flex-1 text-sm sm:text-base">⏰ {t.message}</span>
          <div className="flex shrink-0 items-center gap-2">
            <button className="rounded-lg bg-white/15 px-2.5 py-1.5 text-xs font-semibold transition hover:bg-white/25" onClick={() => dispatch({ type: 'SNOOZE_TOAST', payload: t.id })}>Posponer 5 min</button>
            <button aria-label="Descartar aviso" className="grid h-7 w-7 place-items-center rounded-lg text-lg transition hover:bg-white/20" onClick={() => dispatch({ type: 'DISMISS_TOAST', payload: t.id })}>×</button>
          </div>
        </div>
      ))}
    </div>
  );
}
