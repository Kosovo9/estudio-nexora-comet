'use client';

import React, { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowLeft, Sun, Moon, Globe, Bell, Shield, Database, Palette } from 'lucide-react';

type Language = 'es' | 'en';

const DICTIONARY = {
  es: {
    title: 'Configuración',
    subtitle: 'Ajusta las preferencias de tu cuenta',
    backToHome: 'Volver al Inicio',
    theme: 'Tema',
    language: 'Idioma',
    notifications: 'Notificaciones',
    security: 'Seguridad',
    data: 'Datos',
    appearance: 'Apariencia',
    darkMode: 'Modo Oscuro',
    lightMode: 'Modo Claro',
    spanish: 'Español',
    english: 'Inglés',
    enableNotifications: 'Habilitar Notificaciones',
    twoFactor: 'Autenticación de Dos Factores',
    backup: 'Copia de Seguridad',
    save: 'Guardar Cambios',
    saved: 'Cambios guardados exitosamente',
  },
  en: {
    title: 'Settings',
    subtitle: 'Adjust your account preferences',
    backToHome: 'Back to Home',
    theme: 'Theme',
    language: 'Language',
    notifications: 'Notifications',
    security: 'Security',
    data: 'Data',
    appearance: 'Appearance',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    spanish: 'Spanish',
    english: 'English',
    enableNotifications: 'Enable Notifications',
    twoFactor: 'Two-Factor Authentication',
    backup: 'Backup',
    save: 'Save Changes',
    saved: 'Changes saved successfully',
  },
};

export default function ConfiguracionPage() {
  const [lang, setLang] = useState<Language>('es');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [saved, setSaved] = useState(false);

  const t = useCallback(
    (key: keyof typeof DICTIONARY['es']) => {
      return DICTIONARY[lang][key];
    },
    [lang]
  );

  const handleSave = useCallback(() => {
    // Simular guardado
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    console.log('Configuración guardada:', { theme, lang, notifications, twoFactor });
  }, [theme, lang, notifications, twoFactor]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar lang={lang} onLanguageToggle={() => setLang(prev => prev === 'es' ? 'en' : 'es')} />
      
      <main className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
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

          {/* Settings Sections */}
          <div className="space-y-6">
            {/* Appearance */}
            <section className="bg-black/70 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Palette size={20} className="text-blue-400" />
                <h2 className="text-xl font-semibold">{t('appearance')}</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('theme')}</label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        theme === 'dark'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <Moon size={18} />
                      <span>{t('darkMode')}</span>
                    </button>
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        theme === 'light'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <Sun size={18} />
                      <span>{t('lightMode')}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('language')}</label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setLang('es')}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        lang === 'es'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {t('spanish')}
                    </button>
                    <button
                      onClick={() => setLang('en')}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        lang === 'en'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {t('english')}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Notifications */}
            <section className="bg-black/70 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Bell size={20} className="text-blue-400" />
                <h2 className="text-xl font-semibold">{t('notifications')}</h2>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">{t('enableNotifications')}</span>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </section>

            {/* Security */}
            <section className="bg-black/70 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Shield size={20} className="text-blue-400" />
                <h2 className="text-xl font-semibold">{t('security')}</h2>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">{t('twoFactor')}</span>
                <button
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    twoFactor ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      twoFactor ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </section>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg shadow-xl transition-all duration-200 transform hover:from-purple-500 hover:to-blue-500 hover:scale-105 active:scale-95"
              >
                {saved ? t('saved') : t('save')}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

