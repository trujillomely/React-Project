import { useState } from 'react';
import { CATEGORIES } from '../utils/constants.js';
import { reminderLabel } from '../utils/events.js';

const COLORS = [
  { label: 'Azul', value: '#49a8d8' }, { label: 'Violeta', value: '#8b6add' },
  { label: 'Coral', value: '#e87872' }, { label: 'Naranja', value: '#e8a33d' },
  { label: 'Verde', value: '#6f9b68' }, { label: 'Rosa', value: '#d56e9b' },
  { label: 'Turquesa', value: '#46aaa0' }, { label: 'Grafito', value: '#667085' },
];
const REMINDER_PRESETS = [5, 10, 15, 30, 60, 1440];
const empty = { title: '', description: '', date: '', time: '', category: 'personal', color: '#8b6add', reminders: [], repeatInterval: 0 };

export default function EventForm({ initialValues, onSubmit, submitLabel = 'Guardar' }) {
  const [values, setValues] = useState({ ...empty, ...initialValues });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  const reminderOptions = [...new Set([...REMINDER_PRESETS, ...values.reminders])].sort((a, b) => a - b);

  const toggleReminder = (min) => setValues((v) => ({
    ...v,
    reminders: v.reminders.includes(min)
      ? v.reminders.filter((reminder) => reminder !== min)
      : [...v.reminders, min].sort((a, b) => a - b),
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!values.title.trim()) errs.title = 'El título es obligatorio';
    if (!values.date) errs.date = 'La fecha es obligatoria';
    if (!values.time) errs.time = 'La hora es obligatoria';
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSubmit({ ...values, title: values.title.trim(), repeatInterval: Number(values.repeatInterval) || 0 });
  };

  const input = 'field w-full px-3.5 py-3 text-sm text-stone-700';
  const err = (f) => errors[f] && <p role="alert" className="mt-1 text-sm text-red-600">{errors[f]}</p>;

  return (
    <form onSubmit={handleSubmit} noValidate className="surface space-y-5 rounded-3xl p-5 sm:p-8">
      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-semibold text-stone-700">Título</label>
        <input id="title" className={input} value={values.title} onChange={set('title')} />
        {err('title')}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className="mb-2 block text-sm font-semibold text-stone-700">Fecha</label>
          <input id="date" type="date" className={input} value={values.date} onChange={set('date')} />
          {err('date')}
        </div>
        <div>
          <label htmlFor="time" className="mb-2 block text-sm font-semibold text-stone-700">Hora</label>
          <input id="time" type="time" className={input} value={values.time} onChange={set('time')} />
          {err('time')}
        </div>
      </div>
      <div>
        <label htmlFor="category" className="mb-2 block text-sm font-semibold text-stone-700">Categoría</label>
        <select id="category" className={input} value={values.category} onChange={set('category')}>
          {Object.entries(CATEGORIES).map(([key, c]) => (
            <option key={key} value={key}>{c.label}</option>
          ))}
        </select>
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-stone-700">Color del evento <span className="font-normal text-stone-400">· Personalizable</span></legend>
        <div className="flex flex-wrap items-center gap-2.5">
          {COLORS.map((color) => <button key={color.value} type="button" aria-label={color.label} aria-pressed={values.color === color.value} onClick={() => setValues((v) => ({ ...v, color: color.value }))} className={`grid h-9 w-9 place-items-center rounded-full transition hover:scale-110 ${values.color === color.value ? 'ring-2 ring-stone-700 ring-offset-2' : 'ring-1 ring-black/5'}`} style={{ backgroundColor: color.value }}>{values.color === color.value && <span className="text-sm font-bold text-white">✓</span>}</button>)}
          <label className="relative grid h-9 w-9 cursor-pointer place-items-center overflow-hidden rounded-full border border-stone-200 bg-white text-lg text-stone-500" title="Elegir otro color">＋<input aria-label="Color personalizado" type="color" value={values.color || empty.color} onChange={(e) => setValues((v) => ({ ...v, color: e.target.value }))} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" /></label>
          <span className="ml-1 text-xs text-stone-500">{COLORS.find((color) => color.value === values.color)?.label || 'Personalizado'}</span>
        </div>
      </fieldset>
      <div>
        <label htmlFor="description" className="mb-2 block text-sm font-semibold text-stone-700">Descripción <span className="font-normal text-stone-400">· Opcional</span></label>
        <textarea id="description" rows={3} className={input} value={values.description} onChange={set('description')} />
      </div>

      <fieldset>
        <legend className="mb-1 text-sm font-semibold text-stone-700">Recordatorios <span className="font-normal text-stone-400">· Opcional</span></legend>
        <p className="mb-3 text-xs text-stone-500">Selecciona una o varias opciones para recibir avisos.</p>
        <div className="flex flex-wrap gap-2">
          {reminderOptions.map((min) => {
            const active = values.reminders.includes(min);
            return <button key={min} type="button" aria-pressed={active} onClick={() => toggleReminder(min)} className={`rounded-xl border px-3.5 py-2 text-sm font-semibold transition ${active ? 'border-[#71856b] bg-[#e7ede4] text-[#496044]' : 'border-stone-200 bg-white text-stone-600 hover:border-[#b7c4b1] hover:bg-stone-50'}`}>
              {active && <span className="mr-1.5">✓</span>}{reminderLabel(min)}
            </button>;
          })}
        </div>
        {values.reminders.length > 0 && <div className="mt-4 max-w-xs">
          <label htmlFor="repeatInterval" className="mb-2 block text-sm font-semibold text-stone-700">Repetir recordatorios</label>
          <select id="repeatInterval" className={input} value={values.repeatInterval || 0} onChange={(e) => setValues((v) => ({ ...v, repeatInterval: Number(e.target.value) }))}>
            <option value="0">No repetir</option>
            <option value="5">Cada 5 minutos</option>
            <option value="10">Cada 10 minutos</option>
            <option value="15">Cada 15 minutos</option>
          </select>
          <p className="mt-1.5 text-xs text-stone-500">Volveré a avisarte hasta la hora del evento.</p>
        </div>}
      </fieldset>

      <button type="submit" className="w-full rounded-xl bg-[#52694d] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#42563e] sm:w-auto">
        {submitLabel}
      </button>
    </form>
  );
}
