// Clases completas (Tailwind no detecta clases construidas dinámicamente)
export const CATEGORIES = {
  trabajo: { label: 'Trabajo', badge: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500' },
  personal: { label: 'Personal', badge: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
  reunion: { label: 'Reuniones', badge: 'bg-purple-100 text-purple-800', dot: 'bg-purple-500' },
};

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
