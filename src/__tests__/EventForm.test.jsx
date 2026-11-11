import { fireEvent, render, screen } from '@testing-library/react';
import EventForm from '../components/EventForm.jsx';

describe('EventForm', () => {
  test('muestra errores si faltan campos obligatorios', () => {
    const onSubmit = jest.fn();
    render(<EventForm onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));
    expect(screen.getByText('El título es obligatorio')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('envía los datos y los recordatorios predefinidos seleccionados', () => {
    const onSubmit = jest.fn();
    render(<EventForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Cita médica' } });
    fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: '2026-11-20' } });
    fireEvent.change(screen.getByLabelText('Hora'), { target: { value: '08:30' } });
    fireEvent.change(screen.getByLabelText('Categoría'), { target: { value: 'personal' } });
    fireEvent.click(screen.getByRole('button', { name: 'Azul' }));
    fireEvent.click(screen.getByRole('button', { name: '30 min antes' }));
    fireEvent.click(screen.getByRole('button', { name: '1 h antes' }));
    fireEvent.change(screen.getByLabelText('Repetir recordatorios'), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Cita médica', date: '2026-11-20', time: '08:30', color: '#49a8d8', reminders: [30, 60], repeatInterval: 10 })
    );
  });

  test('permite quitar un recordatorio', () => {
    render(<EventForm initialValues={{ reminders: [10] }} onSubmit={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /10 min antes/ }));
    expect(screen.getByRole('button', { name: '10 min antes' })).toHaveAttribute('aria-pressed', 'false');
  });
});
