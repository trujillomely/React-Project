import { useLayoutEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ReminderWatcher from './components/ReminderWatcher.jsx';
import Toasts from './components/Toasts.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import EditEventPage from './pages/EditEventPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import NewEventPage from './pages/NewEventPage.jsx';

export default function App() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('eventos-app:theme') === 'dark' ? 'dark' : 'light'; }
    catch { return 'light'; }
  });

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem('eventos-app:theme', theme); } catch { /* almacenamiento no disponible */ }
  }, [theme]);

  return (
    <>
      <Navbar theme={theme} onToggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Routes>
          <Route path="/" element={<EventsPage />} />
          <Route path="/calendario" element={<CalendarPage />} />
          <Route path="/nuevo" element={<NewEventPage />} />
          <Route path="/editar/:id" element={<EditEventPage />} />
          <Route path="*" element={<p>Página no encontrada.</p>} />
        </Routes>
      </main>
      <ReminderWatcher />
      <Toasts />
    </>
  );
}
