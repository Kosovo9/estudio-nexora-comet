'use client';

import React, { useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ChevronRight, RotateCw, ArrowLeft } from 'lucide-react';

// Lazy load del componente Earth para mejor rendimiento
const Earth3D = dynamic(() => import('@/components/Earth3D'), { ssr: false });

type Language = 'es' | 'en';

const DICTIONARY = {
  es: {
    title: 'Panel de Control',
    subtitle: 'Gestión completa de funcionalidades',
    backToHome: 'Volver al Inicio',
    rotationSpeed: 'Velocidad de Rotación',
    menuItem1: 'Análisis Orbital',
    menuItem2: 'Modelado 3D',
    menuItem3: 'Procesamiento IA',
    menuItem4: 'Ajustes de Luz',
    menuItem5: 'Calibración de Color',
    menuItem6: 'Exportar Datos',
    menuItem7: 'Gestión de Proyectos',
    menuItem8: 'Historial de Versiones',
    menuItem9: 'Preferencias de Usuario',
    menuItem10: 'Ayuda y Tutoriales',
    menuItem11: 'Notificaciones',
    menuItem12: 'Mi Perfil',
    menuItem13: 'Actualizar Plan',
    menuItem14: 'Integraciones',
    menuItem15: 'Modo Oscuro',
    menuItem16: 'Zoom In',
    menuItem17: 'Zoom Out',
    menuItem18: 'Resetear Vista',
    menuItem19: 'Captura de Pantalla',
    menuItem20: 'Compartir',
    menuItem21: 'Guardar Proyecto',
    menuItem22: 'Cargar Proyecto',
    menuItem23: 'Nuevo Archivo',
    menuItem24: 'Deshacer',
    menuItem25: 'Rehacer',
    menuItem26: 'Filtro de Nubes',
    menuItem27: 'Filtro de Océano',
    menuItem28: 'Filtro de Tierra',
    menuItem29: 'Añadir Capa',
    menuItem30: 'Eliminar Capa',
    menuItem31: 'Propiedades de Capa',
    menuItem32: 'Vista Satelital',
    menuItem33: 'Vista Terrestre',
    menuItem34: 'Vista Nocturna',
    menuItem35: 'Vista Térmica',
    menuItem36: 'Medir Distancia',
    menuItem37: 'Añadir Marcador',
    menuItem38: 'Buscar Ubicación',
    menuItem39: 'Modo de Edición',
    menuItem40: 'Modo de Visualización',
    menuItem41: 'Panel de Control',
    menuItem42: 'Monitor de Rendimiento',
    menuItem43: 'Registro de Errores',
    menuItem44: 'Backup Automático',
    menuItem45: 'Sincronizar Nube',
    menuItem46: 'Atajos de Teclado',
    menuItem47: 'Acerca de',
    menuItem48: 'Términos de Servicio',
    menuItem49: 'Política de Privacidad',
    menuItem50: 'Cerrar Sesión',
  },
  en: {
    title: 'Control Panel',
    subtitle: 'Complete functionality management',
    backToHome: 'Back to Home',
    rotationSpeed: 'Rotation Speed',
    menuItem1: 'Orbital Analysis',
    menuItem2: '3D Modeling',
    menuItem3: 'AI Processing',
    menuItem4: 'Light Settings',
    menuItem5: 'Color Calibration',
    menuItem6: 'Export Data',
    menuItem7: 'Project Management',
    menuItem8: 'Version History',
    menuItem9: 'User Preferences',
    menuItem10: 'Help and Tutorials',
    menuItem11: 'Notifications',
    menuItem12: 'My Profile',
    menuItem13: 'Upgrade Plan',
    menuItem14: 'Integrations',
    menuItem15: 'Dark Mode',
    menuItem16: 'Zoom In',
    menuItem17: 'Zoom Out',
    menuItem18: 'Reset View',
    menuItem19: 'Screenshot',
    menuItem20: 'Share',
    menuItem21: 'Save Project',
    menuItem22: 'Load Project',
    menuItem23: 'New File',
    menuItem24: 'Undo',
    menuItem25: 'Redo',
    menuItem26: 'Cloud Filter',
    menuItem27: 'Ocean Filter',
    menuItem28: 'Land Filter',
    menuItem29: 'Add Layer',
    menuItem30: 'Delete Layer',
    menuItem31: 'Layer Properties',
    menuItem32: 'Satellite View',
    menuItem33: 'Ground View',
    menuItem34: 'Night View',
    menuItem35: 'Thermal View',
    menuItem36: 'Measure Distance',
    menuItem37: 'Add Marker',
    menuItem38: 'Search Location',
    menuItem39: 'Edit Mode',
    menuItem40: 'View Mode',
    menuItem41: 'Control Panel',
    menuItem42: 'Performance Monitor',
    menuItem43: 'Error Log',
    menuItem44: 'Automatic Backup',
    menuItem45: 'Cloud Sync',
    menuItem46: 'Keyboard Shortcuts',
    menuItem47: 'About',
    menuItem48: 'Terms of Service',
    menuItem49: 'Privacy Policy',
    menuItem50: 'Log Out',
  },
};

export default function PanelPage() {
  const [lang, setLang] = useState<Language>('es');
  const [rotationSpeedFactor, setRotationSpeedFactor] = useState(1);

  const t = useCallback(
    (key: keyof typeof DICTIONARY['es']) => {
      return DICTIONARY[lang][key];
    },
    [lang]
  );

  const handleAction = useCallback((action: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp} - ${lang.toUpperCase()}] Acción: ${action}`;
    console.log(logEntry);
    // Aquí puedes agregar lógica adicional para cada acción
  }, [lang]);

  const functionalMenuItems = useMemo(() => {
    const items = [];
    for (let i = 1; i <= 50; i++) {
      const key = `menuItem${i}` as keyof typeof DICTIONARY['es'];
      items.push({
        id: i,
        text: t(key),
        onClick: () => handleAction(t(key)),
      });
    }
    return items;
  }, [t, handleAction]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar lang={lang} onLanguageToggle={() => setLang(prev => prev === 'es' ? 'en' : 'es')} />
      
      <main className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              <span>{t('backToHome')}</span>
            </Link>
            <h1 className="text-4xl font-extrabold mb-2">{t('title')}</h1>
            <p className="text-gray-400">{t('subtitle')}</p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Panel de Control - Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-black/70 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 p-6">
                <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-3">
                  {t('title')} ({functionalMenuItems.length} Funciones)
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[600px] overflow-y-auto">
                  {functionalMenuItems.map(item => (
                    <button
                      key={item.id}
                      onClick={item.onClick}
                      className="flex items-center text-sm text-gray-300 p-3 rounded-lg transition-all duration-200 hover:bg-blue-600/50 hover:text-white hover:scale-105 active:scale-95 border border-gray-700 hover:border-blue-500"
                      title={item.text}
                    >
                      <ChevronRight size={14} className="mr-2 flex-shrink-0" />
                      <span className="truncate">{item.text}</span>
                    </button>
                  ))}
                </div>

                {/* Control de Rotación */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="flex items-center space-x-3">
                    <RotateCw size={20} className="text-blue-400 flex-shrink-0" />
                    <label htmlFor="rotation-slider" className="text-sm font-medium text-white flex-shrink-0 w-32">
                      {t('rotationSpeed')} ({rotationSpeedFactor.toFixed(1)}x)
                    </label>
                    <input
                      id="rotation-slider"
                      type="range"
                      min="0"
                      max="5"
                      step="0.1"
                      value={rotationSpeedFactor}
                      onChange={(e) => setRotationSpeedFactor(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      style={{ accentColor: '#3b82f6' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Earth 3D Preview */}
            <div className="lg:col-span-1">
              <div className="bg-black/70 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 p-6 h-[400px]">
                <h3 className="text-lg font-semibold mb-4">Vista 3D</h3>
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <Earth3D rotationSpeedFactor={rotationSpeedFactor} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

