import { useNavigate, useSearchParams } from 'react-router-dom';
import EventForm from '../components/EventForm.jsx';
import { useEvents } from '../context/EventsContext.jsx';
import { uid } from '../utils/constants.js';

export default function NewEventPage() {
  const { dispatch } = useEvents();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialValues = {
    date: searchParams.get('date') || '',
    time: searchParams.get('time') || '',
  };
  return (
    <>
      <header className="mb-7"><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-[#71856b]">Un nuevo plan</p><h1 className="font-display text-3xl font-extrabold tracking-tight text-stone-800 sm:text-4xl">Nuevo evento<span className="text-[#8ea287]">.</span></h1><p className="mt-2 text-sm text-stone-500">Añade los detalles y deja que tu agenda se encargue del resto.</p></header>
      <EventForm
        initialValues={initialValues}
        submitLabel="Crear evento"
        onSubmit={(values) => {
          dispatch({ type: 'ADD_EVENT', payload: { ...values, id: uid() } });
          navigate('/');
        }}
      />
    </>
  );
}
