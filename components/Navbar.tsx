'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Grid3x3, Globe, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  lang: 'es' | 'en';
  onLanguageToggle: () => void;
  onThemeToggle?: () => void;
}

const DICTIONARY = {
  es: {
    home: 'Inicio',
    panel: 'Panel de Control',
    config: 'Configuración',
    language: 'EN',
  },
  en: {
    home: 'Home',
    panel: 'Control Panel',
    config: 'Settings',
    language: 'ES',
  },
};

export default function Navbar({ lang, onLanguageToggle, onThemeToggle }: NavbarProps) {
  const pathname = usePathname();
  const t = DICTIONARY[lang];

  const navItems = [
    { href: '/', label: t.home, icon: Home },
    { href: '/panel', label: t.panel, icon: Grid3x3 },
    { href: '/configuracion', label: t.config, icon: Settings },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600">
              Studio Nexora Comet
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            {onThemeToggle && (
              <button
                onClick={onThemeToggle}
                className="p-2 text-gray-300 rounded-lg transition-colors duration-200 hover:bg-white/10 hover:text-white"
                aria-label="Toggle theme"
              >
                <Sun size={20} />
              </button>
            )}

            {/* Language Toggle */}
            <button
              onClick={onLanguageToggle}
              className="px-3 py-1.5 bg-white/10 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/20"
            >
              {t.language}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden border-t border-white/10">
        <div className="px-4 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
