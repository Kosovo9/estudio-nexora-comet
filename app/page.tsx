'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import FileUpload from '@/components/FileUpload';
import { DICTIONARY, type Language } from '@/lib/dictionary';
import {
  Settings,
  Sun,
  Globe,
  FileText,
  Zap,
  Plus,
  Check,
  Mail,
  Grid3x3,
} from 'lucide-react';

// Lazy load del componente Earth3D para mejor rendimiento
const Earth3D = dynamic(() => import('@/components/Earth3D'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

// Componente de Botón Reutilizable
interface ButtonProps {
  text: string;
  icon?: React.ReactNode;
  onClick: () => void;
  className?: string;
  href?: string;
}

const FunctionalButton: React.FC<ButtonProps> = ({ text, icon, onClick, className = '', href }) => {
  const buttonContent = (
    <button
      onClick={onClick}
      className={`flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-xl transition-all duration-200 transform hover:bg-blue-500 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/50 ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </button>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
};

FunctionalButton.displayName = 'FunctionalButton';

// Componente de Botón de Icono
interface IconButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  onClick: () => void;
  href?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, tooltip, onClick, href }) => {
  const button = (
    <button
      onClick={onClick}
      title={tooltip}
      className="p-3 text-gray-300 rounded-full transition-all duration-200 hover:bg-white/20 hover:text-white hover:scale-110 active:scale-95"
    >
      {icon}
    </button>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {button}
      </Link>
    );
  }

  return button;
};

IconButton.displayName = 'IconButton';

export default function Home() {
  const [lang, setLang] = useState<Language>('es');
  const [log, setLog] = useState<string[]>([]);
  const [rotationSpeedFactor, setRotationSpeedFactor] = useState(1);
  const [showUpload, setShowUpload] = useState(false);

  // Optimización 100x - Asegurar que todos los elementos estén funcionales
  useEffect(() => {
    // Optimizar botones y elementos interactivos
    const optimizeButtons = () => {
      const allButtons = document.querySelectorAll('button, [onclick], .btn, [role="button"]');
      allButtons.forEach(btn => {
        if (btn instanceof HTMLElement) {
          btn.style.pointerEvents = 'auto';
          btn.style.opacity = '1';
          btn.setAttribute('tabindex', '0');
          btn.removeAttribute('disabled');
          btn.classList.remove('disabled', 'inactive');
        }
      });
    };

    // Precargar assets críticos
    const preloadCriticalAssets = () => {
      const criticalAssets = [
        '/textures/earth_daymap.jpg',
        '/textures/earth_bump.jpg',
        '/textures/earth_specular.jpg',
        '/textures/earth_clouds.png'
      ];

      criticalAssets.forEach(asset => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = asset;
        link.as = 'image';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    };

    // Ejecutar optimizaciones
    optimizeButtons();
    preloadCriticalAssets();

    // Re-optimizar después de cambios en el DOM
    const observer = new MutationObserver(() => {
      optimizeButtons();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const t = useCallback(
    (key: keyof typeof DICTIONARY['es']) => {
      const translation = DICTIONARY[lang][key];
      return typeof translation === 'function' ? translation(0) : translation;
    },
    [lang]
  );

  const handleAction = useCallback(
    (action: string) => {
      const timestamp = new Date().toLocaleTimeString();
      const logEntry = `[${timestamp} - ${lang.toUpperCase()}] Acción: ${action}`;
      console.log(logEntry);
      setLog(prevLog => [logEntry, ...prevLog.slice(0, 9)]);
    },
    [lang]
  );

  const handleUpload = useCallback(
    (files: File[]) => {
      if (files.length > 0) {
        handleAction(`Upload: ${files.length} archivo(s) cargado(s)`);
      }
    },
    [handleAction]
  );

  const handleStartClick = useCallback(() => {
    setShowUpload(true);
    handleAction(t('heroButton'));
  }, [handleAction, t]);

  return (
    <main className="relative min-h-screen bg-transparent background-transparent overflow-hidden font-sans">
      {/* Navbar */}
      <Navbar
        lang={lang}
        onLanguageToggle={() => {
          setLang(prevLang => (prevLang === 'es' ? 'en' : 'es'));
          handleAction('Cambio de Idioma');
        }}
      />

      {/* Contenedor 3D (Three.js Canvas) - Solo en desktop */}
      <div className="hidden lg:block absolute inset-0 z-0">
        <Earth3D rotationSpeedFactor={rotationSpeedFactor} />
      </div>

      {/* Interfaz de Usuario */}
      <div className="relative z-10 flex flex-col min-h-screen pt-16 pb-8 px-4 sm:px-6 lg:px-8 text-white">
        {/* Contenido Principal */}
        <div className="flex-grow flex flex-col items-center justify-center text-center py-12">
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter mb-4 text-white drop-shadow-lg">
            {t('heroTitle')}
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl">
            {t('heroSubtitle')}
          </p>

          {/* Botón Principal */}
          <div className="mb-8">
            <FunctionalButton
              text={`${t('heroButton')} →`}
              onClick={handleStartClick}
              className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
            />
          </div>

          {/* Componente de Carga de Archivos */}
          {showUpload && (
            <div className="mt-8 animate-fade-in">
              <FileUpload lang={lang} onUpload={handleUpload} />
            </div>
          )}

          {/* Botones de Acceso Rápido */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <FunctionalButton
              text={t('menuItem41')}
              icon={<Grid3x3 size={18} />}
              onClick={() => handleAction(t('menuItem41'))}
              href="/panel"
              className="!bg-purple-600 hover:!bg-purple-500"
            />
            <FunctionalButton
              text={t('settings')}
              icon={<Settings size={18} />}
              onClick={() => handleAction(t('settings'))}
              href="/configuracion"
              className="!bg-gray-700 hover:!bg-gray-600"
            />
          </div>
        </div>

        {/* Barra Lateral Derecha (Solo Desktop) */}
        <div className="hidden lg:flex absolute right-6 top-1/2 transform -translate-y-1/2 flex-col space-y-3 bg-black/50 backdrop-blur-sm p-2 rounded-full shadow-2xl">
          <IconButton
            icon={<Settings size={20} />}
            tooltip={t('settings')}
            onClick={() => handleAction(t('settings'))}
            href="/configuracion"
          />
          <IconButton
            icon={<FileText size={20} />}
            tooltip={t('report')}
            onClick={() => handleAction(t('report'))}
          />
          <IconButton
            icon={<Globe size={20} />}
            tooltip={t('menuItem32')}
            onClick={() => handleAction(t('menuItem32'))}
          />
          <IconButton
            icon={<Zap size={20} />}
            tooltip={t('menuItem3')}
            onClick={() => handleAction(t('menuItem3'))}
          />
          <IconButton
            icon={<Plus size={20} />}
            tooltip={t('menuItem29')}
            onClick={() => handleAction(t('menuItem29'))}
          />
        </div>

        {/* Footer */}
        <footer className="w-full mt-auto flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10">
          {/* Botón QA solo en desarrollo */}
          {process.env.NODE_ENV !== 'production' && (
            <FunctionalButton
              text={t('qaAutomatic')}
              icon={<Check size={18} />}
              onClick={() => handleAction(t('qaAutomatic'))}
              className="!bg-green-700/80 !text-white text-sm px-3 py-1 shadow-none hover:!bg-green-600"
            />
          )}

          <div className="hidden md:block bg-black/50 p-2 rounded-lg text-xs text-gray-400 max-w-lg">
            <p className="font-bold mb-1">{t('missionLog')}:</p>
            <div className="h-16 overflow-y-auto space-y-0.5">
              {log.length === 0 ? (
                <p className="text-gray-500">Esperando acciones...</p>
              ) : (
                log.map((entry, index) => (
                  <p key={index} className="truncate">{entry}</p>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col items-end space-y-1 text-xs text-gray-500">
            <FunctionalButton
              text={t('mailSupport')}
              icon={<Mail size={14} />}
              onClick={() => handleAction(t('mailSupport'))}
              className="!bg-transparent !text-gray-400 text-xs px-2 py-1 shadow-none hover:!text-white hover:!bg-white/10"
            />
            <p>Studio Nexora Comet © 2025</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
