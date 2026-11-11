import { useEvents } from '../context/EventsContext.jsx';
import { CATEGORIES } from '../utils/constants.js';

export default function EventFilters() {
  const { state: { filters }, dispatch } = useEvents();
  const set = (field) => (e) => dispatch({ type: 'SET_FILTERS', payload: { [field]: e.target.value } });
  const input = 'field min-h-11 px-4 py-2.5 text-sm text-stone-700';

  return (
    <div className="surface mb-5 flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:p-4">
      <label className="relative min-w-0 flex-1"><span className="sr-only">Buscar eventos</span><span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">⌕</span><input aria-label="Buscar" placeholder="Busca un evento..." className={`${input} w-full pl-10`} value={filters.search} onChange={set('search')} /></label>
      <select aria-label="Filtrar por categoría" className={`${input} sm:min-w-48`} value={filters.category} onChange={set('category')}>
        <option value="all">Todas las categorías</option>
        {Object.entries(CATEGORIES).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
      </select>
      <select aria-label="Ordenar por" className={`${input} sm:min-w-44`} value={filters.sortBy} onChange={set('sortBy')}>
        <option value="date">Ordenar por fecha</option>
        <option value="title">Ordenar por título</option>
      </select>
    </div>
  );
}
