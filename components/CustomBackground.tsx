'use client';

/**
 * CustomBackground - Componente que asegura que el fondo sea transparente
 * Este componente previene cualquier recuadro blanco no deseado
 */
export default function CustomBackground() {
  return (
    <div 
      className="fixed inset-0 -z-10 bg-transparent pointer-events-none"
      style={{
        background: 'transparent',
        backgroundColor: 'transparent',
        display: 'none', // Oculto por defecto, solo se activa si es necesario
      }}
      aria-hidden="true"
    />
  );
}

