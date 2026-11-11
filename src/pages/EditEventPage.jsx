import { Link, useNavigate, useParams } from 'react-router-dom';
import EventForm from '../components/EventForm.jsx';
import { useEvents } from '../context/EventsContext.jsx';

export default function EditEventPage() {
  const { id } = useParams();
  const { state, dispatch } = useEvents();
  const navigate = useNavigate();
  const event = state.events.find((e) => e.id === id);

  if (!event) {
    return <p>Evento no encontrado. <Link className="text-indigo-600 underline" to="/">Volver</Link></p>;
  }
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Editar evento</h1>
      <EventForm
        initialValues={event}
        submitLabel="Guardar cambios"
        onSubmit={(values) => {
          dispatch({ type: 'UPDATE_EVENT', payload: { ...values, id } });
          navigate('/');
        }}
      />
    </>
  );
}
