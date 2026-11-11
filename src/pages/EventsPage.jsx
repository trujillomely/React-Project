import EventFilters from '../components/EventFilters.jsx';
import EventList from '../components/EventList.jsx';

export default function EventsPage() {
  return (
    <>
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-[#71856b]">Tu agenda personal</p><h1 className="font-display text-3xl font-extrabold tracking-tight text-stone-800 sm:text-4xl">Mis eventos<span className="text-[#8ea287]">.</span></h1><p className="mt-2 text-sm text-stone-500">Todo lo que tienes por delante, en un solo lugar.</p></div>
      </header>
      <EventFilters />
      <EventList />
    </>
  );
}
