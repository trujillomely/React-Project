import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEvents } from '../context/EventsContext.jsx';
import { CATEGORIES } from '../utils/constants.js';
import { eventStart, filterAndSort, reminderLabel } from '../utils/events.js';

export default function EventList() {
  const { state, dispatch } = useEvents();
  const visible = filterAndSort(state.events, state.filters);

  if (visible.length === 0) {
    return <div className="surface rounded-3xl px-6 py-14 text-center"><span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#edf1ea] text-2xl text-[#52694d]">✳</span><h2 className="font-display text-xl font-bold text-stone-800">No encontramos eventos</h2><p className="mx-auto mt-2 max-w-sm text-sm text-stone-500">Prueba con otra búsqueda o categoría, o crea un evento nuevo para empezar.</p><Link to="/nuevo" className="mt-5 inline-flex rounded-xl bg-[#52694d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#42563e]">＋ Crear evento</Link></div>;
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {visible.map((e) => (
        <li key={e.id} className="surface group flex min-w-0 flex-col justify-between gap-5 rounded-2xl p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex gap-4">
            <div className="grid h-[58px] w-[58px] shrink-0 content-center justify-items-center rounded-2xl text-white" style={{ backgroundColor: e.color || '#71856b' }}><span className="text-[10px] font-bold uppercase tracking-wider">{format(eventStart(e), 'MMM', { locale: es })}</span><span className="font-display text-xl font-extrabold leading-6">{format(eventStart(e), 'd')}</span></div>
            <div className="min-w-0 flex-1"><p className="mb-1 text-xs font-semibold capitalize text-stone-400">{format(eventStart(e), 'EEEE', { locale: es })} <span className="mx-1">·</span> {format(eventStart(e), 'HH:mm')}</p>
            <h3 className="truncate font-display text-lg font-bold text-stone-800">{e.title}</h3>
            {e.description && <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-stone-500">{e.description}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${CATEGORIES[e.category]?.badge}`}>{CATEGORIES[e.category]?.label}</span>
              {e.reminders.map((m) => (
                <span key={m} className="rounded-full bg-[#f7f0df] px-2.5 py-1 text-xs font-medium text-[#957644]">◷ {reminderLabel(m)}</span>
              ))}
              {e.repeatInterval > 0 && <span className="rounded-full bg-[#edf1ea] px-2.5 py-1 text-xs font-medium text-[#52694d]">↻ cada {e.repeatInterval} min</span>}
            </div></div>
          </div>
          <div className="flex justify-end gap-2 border-t border-stone-100 pt-3">
            <Link to={`/editar/${e.id}`} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-stone-500 transition hover:bg-stone-100 hover:text-stone-800">Editar</Link>
            <button
              onClick={() => dispatch({ type: 'DELETE_EVENT', payload: e.id })}
              aria-label={`Eliminar ${e.title}`}
              className="rounded-lg px-3 py-1.5 text-sm font-semibold text-stone-400 transition hover:bg-red-50 hover:text-red-600"
            >
              Eliminar
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
