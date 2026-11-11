import React, { useState } from 'react';
import {
  addDays, addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format,
  isSameDay, isSameMonth, startOfMonth, startOfWeek, subMonths,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { useEvents } from '../context/EventsContext.jsx';
import { CATEGORIES } from '../utils/constants.js';
import { eventStart } from '../utils/events.js';

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const START_HOUR = 7;
const END_HOUR = 21;
const HOUR_HEIGHT = 64;
const colorFor = (event) => event.color || ({ trabajo: '#49a8d8', personal: '#7a69d6', reunion: '#e6a93e' }[event.category] || '#71856b');

export default function CalendarView({ initialDate = new Date() }) {
  const { state, dispatch } = useEvents();
  const [month, setMonth] = useState(initialDate);
  const [selected, setSelected] = useState(initialDate);
  const [view, setView] = useState('week');
  const [openEvent, setOpenEvent] = useState(null);
  const week = eachDayOfInterval({ start: startOfWeek(selected, { weekStartsOn: 1 }), end: endOfWeek(selected, { weekStartsOn: 1 }) });
  const visibleDays = view === 'day' ? [selected] : week;
  const miniDays = eachDayOfInterval({ start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }), end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }) });
  const eventsOf = (day) => state.events.filter((event) => isSameDay(eventStart(event), day)).sort((a, b) => eventStart(a) - eventStart(b));
  const today = new Date();
  const selectedEvents = eventsOf(selected);

  return (
    <div className="surface overflow-hidden rounded-3xl">
      <div className="flex flex-col lg:min-h-[690px] lg:flex-row">
        <aside className="w-full shrink-0 border-b border-stone-200 bg-[#faf9f6] p-5 sm:p-6 lg:w-64 lg:border-b-0 lg:border-r">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-base font-extrabold capitalize text-stone-800" data-testid="month-title">{format(month, 'MMMM yyyy', { locale: es })}</h2>
            <div className="flex gap-1">
              <button onClick={() => { const next = subMonths(selected, 1); setSelected(next); setMonth(next); }} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-stone-200" aria-label="Mes anterior">‹</button>
              <button onClick={() => { const next = addMonths(selected, 1); setSelected(next); setMonth(next); }} className="grid h-8 w-8 place-items-center rounded-lg text-stone-500 hover:bg-stone-200" aria-label="Mes siguiente">›</button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-y-1 text-center">
            {WEEKDAYS.map((day) => <span key={day} className="py-1 text-[9px] font-bold uppercase text-stone-400">{day.slice(0, 1)}</span>)}
            {miniDays.map((day) => {
              const dayEvents = eventsOf(day);
              return <button key={day.toISOString()} onClick={() => { setSelected(day); setMonth(day); setView('day'); }} aria-label={format(day, 'yyyy-MM-dd')} className={`relative mx-auto grid h-8 w-8 place-items-center rounded-full text-xs transition ${!isSameMonth(day, month) ? 'text-stone-300' : 'text-stone-700 hover:bg-stone-200'} ${isSameDay(day, selected) ? 'bg-[#52694d] font-bold text-white hover:bg-[#52694d]' : ''} ${isSameDay(day, today) && !isSameDay(day, selected) ? 'font-extrabold text-[#52694d]' : ''}`}>
                {format(day, 'd')}{dayEvents.length > 0 && <span className="absolute bottom-0.5 h-1 w-1 rounded-full" style={{ backgroundColor: isSameDay(day, selected) ? '#fff' : colorFor(dayEvents[0]) }} />}
              </button>;
            })}
          </div>

          <section className="mt-7 border-t border-stone-200 pt-5" aria-label="Agenda del día">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[.15em] text-[#71856b]">Agenda del día</p>
            <h3 className="mb-4 font-display text-sm font-bold capitalize text-stone-800">{format(selected, "EEEE d 'de' MMMM", { locale: es })}</h3>
            {selectedEvents.length ? <ul className="space-y-1">{selectedEvents.map((event) => <li key={event.id}><button type="button" onClick={() => setOpenEvent(event)} className="flex w-full items-start gap-2.5 rounded-xl p-2 text-left transition hover:bg-white"><span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: colorFor(event) }} /><span className="min-w-0"><span className="block text-[11px] text-stone-400">{event.time}</span><span className="block truncate text-xs font-semibold text-stone-700">{event.title}</span></span><span className="ml-auto text-stone-300">›</span></button></li>)}</ul> : <p className="text-xs leading-relaxed text-stone-400">No hay planes para este día.</p>}
            <Link to="/nuevo" className="mt-5 inline-flex text-xs font-bold text-[#52694d] hover:underline">＋ Añadir evento</Link>
          </section>
        </aside>

        <section className="min-w-0 flex-1 p-4 sm:p-6" aria-label={view === 'day' ? 'Vista diaria' : 'Vista semanal'}>
          <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div><p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-[#71856b]">{view === 'day' ? 'Vista diaria' : 'Vista semanal'}</p><h2 className="font-display text-xl font-extrabold capitalize text-stone-800 sm:text-2xl">{view === 'day' ? format(selected, "EEEE d 'de' MMMM yyyy", { locale: es }) : <>{format(week[0], 'd MMM', { locale: es })} – {format(week[6], "d MMM yyyy", { locale: es })}</>}</h2></div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-xl border border-stone-200 bg-stone-50 p-1"><button type="button" onClick={() => setView('day')} aria-pressed={view === 'day'} className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${view === 'day' ? 'bg-white text-[#496044] shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}>Día</button><button type="button" onClick={() => setView('week')} aria-pressed={view === 'week'} className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${view === 'week' ? 'bg-white text-[#496044] shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}>Semana</button></div>
              <button type="button" onClick={() => { setSelected(today); setMonth(today); }} className="rounded-xl border border-stone-200 px-3 py-2.5 text-xs font-semibold text-stone-600 transition hover:border-[#b7c4b1] hover:bg-[#f7f9f5]">Hoy</button>
              <Link to="/nuevo" className="rounded-xl bg-[#52694d] px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#42563e] hover:shadow">＋ Evento</Link>
            </div>
          </header>
          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <div className={view === 'day' ? 'min-w-[420px]' : 'min-w-[660px]'}>
              <div className="grid border-b border-stone-200 bg-[#faf9f6]" style={{ gridTemplateColumns: `52px repeat(${visibleDays.length}, minmax(0, 1fr))` }}>
                <div className="border-r border-stone-200" />
                {visibleDays.map((day) => <button key={day.toISOString()} onClick={() => { setSelected(day); setView('day'); }} aria-label={`Ver día ${format(day, 'yyyy-MM-dd')}`} className={`border-r border-stone-200 px-1 py-3 text-center last:border-r-0 ${isSameDay(day, selected) ? 'bg-[#edf1ea]' : 'hover:bg-stone-100'}`}><span className="block text-[9px] font-bold uppercase tracking-wide text-stone-400">{format(day, 'EEE', { locale: es })}</span><span className={`mx-auto mt-1 grid h-7 w-7 place-items-center rounded-full text-sm font-bold ${isSameDay(day, today) ? 'bg-[#52694d] text-white' : 'text-stone-700'}`}>{format(day, 'd')}</span></button>)}
              </div>
              <div className="grid" style={{ gridTemplateColumns: `52px repeat(${visibleDays.length}, minmax(0, 1fr))` }}>
                <div className="bg-[#fcfbf9]">{Array.from({ length: END_HOUR - START_HOUR }, (_, index) => <div key={index} className="relative border-r border-stone-200 text-right" style={{ height: HOUR_HEIGHT }}><span className="absolute -top-2 right-2 text-[9px] font-medium text-stone-400">{format(new Date(2000, 0, 1, START_HOUR + index), 'h a')}</span></div>)}</div>
                {visibleDays.map((day) => <div key={day.toISOString()} className={`relative border-r border-stone-200 last:border-r-0 ${isSameDay(day, selected) ? 'bg-[#fbfcfa]' : 'bg-white'}`} style={{ height: HOUR_HEIGHT * (END_HOUR - START_HOUR) }}>
                  {Array.from({ length: END_HOUR - START_HOUR }, (_, index) => <React.Fragment key={index}><Link to={`/nuevo?date=${format(day, 'yyyy-MM-dd')}&time=${String(START_HOUR + index).padStart(2, '0')}:00`} aria-label={`Crear evento ${format(day, 'd MMMM', { locale: es })} a las ${String(START_HOUR + index).padStart(2, '0')}:00`} className="time-slot absolute inset-x-0 z-0 border-t border-stone-100 bg-transparent transition hover:bg-[#edf1ea]/70" style={{ top: index * HOUR_HEIGHT, height: HOUR_HEIGHT }} /><div className="pointer-events-none absolute inset-x-0 border-t border-stone-100" style={{ top: index * HOUR_HEIGHT }} /></React.Fragment>)}
                  {eventsOf(day).map((event) => {
                    const [hour, minute] = (event.time || '00:00').split(':').map(Number);
                    const top = ((hour + minute / 60) - START_HOUR) * HOUR_HEIGHT;
                    if (top < 0 || top >= HOUR_HEIGHT * (END_HOUR - START_HOUR)) return null;
                    const color = colorFor(event);
                    return <button key={event.id} type="button" onClick={() => setOpenEvent(event)} title={`${event.time} · Ver ${event.title}`} aria-label={`${event.time} ${event.title}; ver detalles`} className="absolute z-[1] block overflow-hidden rounded-lg border-l-4 px-1.5 py-1 text-left text-[9px] leading-tight shadow-sm transition hover:z-10 hover:brightness-[.97] hover:shadow-md sm:px-2 sm:text-[10px]" style={{ top: top + 2, height: 48, left: 3, right: 3, backgroundColor: `${color}20`, borderColor: color, color: '#333b35' }}><span className="block font-bold" style={{ color }}>{event.time}</span><span className="line-clamp-2 font-semibold">{event.title}</span></button>;
                  })}
                </div>)}
              </div>
            </div>
          </div>
        </section>
      </div>
      {openEvent && <div className="fixed inset-0 z-40 grid place-items-center bg-stone-950/35 p-4 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpenEvent(null); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="event-details-title" className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="h-2" style={{ backgroundColor: colorFor(openEvent) }} />
          <div className="p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.14em] text-stone-400">Detalles del evento</p><h2 id="event-details-title" className="font-display text-2xl font-extrabold text-stone-800">{openEvent.title}</h2></div><button type="button" onClick={() => setOpenEvent(null)} aria-label="Cerrar detalles" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-stone-100 text-lg text-stone-500 transition hover:bg-stone-200">×</button></div>
            <div className="mt-5 space-y-3 rounded-2xl bg-[#faf9f6] p-4 text-sm"><p className="font-semibold capitalize text-stone-700">◷ <span className="ml-1">{format(eventStart(openEvent), "EEEE d 'de' MMMM yyyy", { locale: es })}</span><span className="ml-2 text-stone-500">a las {openEvent.time}</span></p><p><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${CATEGORIES[openEvent.category]?.badge}`}>{CATEGORIES[openEvent.category]?.label}</span></p>{openEvent.description && <p className="leading-relaxed text-stone-600">{openEvent.description}</p>}{openEvent.reminders?.length > 0 && <p className="text-xs text-stone-500">Recordatorios: {openEvent.reminders.map((min) => `${min >= 1440 ? `${min / 1440} día(s)` : min >= 60 ? `${min / 60} h` : `${min} min`} antes`).join(' · ')}{openEvent.repeatInterval > 0 ? ` · se repiten cada ${openEvent.repeatInterval} min` : ''}</p>}</div>
            <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => { dispatch({ type: 'DELETE_EVENT', payload: openEvent.id }); setOpenEvent(null); }} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50">Eliminar</button><Link to={`/editar/${openEvent.id}`} className="rounded-xl bg-[#52694d] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#42563e]">Editar evento</Link></div>
          </div>
        </section>
      </div>}
    </div>
  );
}
