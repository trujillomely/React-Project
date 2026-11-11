import { NavLink } from 'react-router-dom';

const link = ({ isActive }) =>
  `rounded-xl px-2 py-2.5 text-xs font-semibold transition sm:px-4 sm:text-sm ${isActive ? 'bg-[#e7ede4] text-[#496044]' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'}`;

export default function Navbar({ theme = 'light', onToggleTheme = () => {} }) {
  return (
    <nav className="sticky top-0 z-20 border-b border-stone-200/80 bg-[#faf9f6]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6">
        <NavLink to="/" className="flex items-center gap-3" aria-label="Eventos, inicio">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#52694d] text-lg text-white shadow-sm">✳</span>
          <span><span className="block font-display text-base font-extrabold tracking-tight text-stone-800">Agenda</span><span className="hidden text-[11px] tracking-wide text-stone-400 sm:block">TU TIEMPO, EN ARMONÍA</span></span>
        </NavLink>
        <div className="flex items-center gap-1 rounded-2xl border border-stone-200/80 bg-white/75 p-1">
          <NavLink to="/" end aria-label="Mis eventos" className={link}><span className="sm:hidden" aria-hidden="true">☷</span><span className="hidden sm:inline">Mis eventos</span></NavLink>
          <NavLink to="/calendario" aria-label="Calendario" className={link}><span className="sm:hidden" aria-hidden="true">▦</span><span className="hidden sm:inline">Calendario</span></NavLink>
        </div>
        <button type="button" onClick={onToggleTheme} aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'} title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-stone-200 bg-white text-lg text-stone-600 shadow-sm transition hover:border-[#b7c4b1] hover:bg-[#f7f9f5] hover:text-[#496044] sm:h-10 sm:w-10">
          <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
        </button>
        <NavLink to="/nuevo" className="flex shrink-0 items-center gap-2 rounded-xl bg-[#52694d] px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#42563e] sm:px-4"><span className="text-lg leading-none">+</span><span className="hidden sm:inline">Nuevo evento</span><span className="sm:hidden">Nuevo</span></NavLink>
      </div>
    </nav>
  );
}
