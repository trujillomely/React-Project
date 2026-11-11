import CalendarView from '../components/CalendarView.jsx';

export default function CalendarPage() {
  return (
    <>
      <header className="mb-7"><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-[#71856b]">Una vista completa</p><h1 className="font-display text-3xl font-extrabold tracking-tight text-stone-800 sm:text-4xl">Calendario<span className="text-[#8ea287]">.</span></h1><p className="mt-2 text-sm text-stone-500">Organiza tus días y descubre lo que viene.</p></header>
      <CalendarView />
    </>
  );
}
