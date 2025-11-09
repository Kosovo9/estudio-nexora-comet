'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { useDropzone } from 'react-dropzone';
import {
  Settings,
  Sun,
  Globe,
  Upload,
  FileText,
  Play,
  Zap,
  MessageSquare,
  Mail,
  User,
  Plus,
  X,
  Check,
  ChevronRight,
  RotateCw, // Nuevo icono para la rotación
} from 'lucide-react';

// --- 1. CONFIGURACIÓN Y TEXTURAS (NASA REALISTAS) ---

// Rutas de texturas (asumiendo que están en /public/textures)
const TEXTURE_PATHS = {
  earth: '/textures/earth_daymap.jpg',
  clouds: '/textures/earth_clouds.png',
  specular: '/textures/earth_specular.jpg',
  bump: '/textures/earth_bump.jpg',
};

// Propiedades para el componente Earth
interface EarthProps {
  rotationSpeedFactor: number; // Factor de velocidad de rotación
}

// Componente para cargar y aplicar texturas
const Earth = React.memo(({ rotationSpeedFactor }: EarthProps) => {
  // Carga de texturas con manejo de errores
  // Si no existen, Three.js usará un color por defecto (negro/gris).
  const [textures, setTextures] = useState<{
    colorMap: THREE.Texture | null;
    cloudsMap: THREE.Texture | null;
    specularMap: THREE.Texture | null;
    bumpMap: THREE.Texture | null;
  } | null>(null);
  const [textureError, setTextureError] = useState(false);

  const earthRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);

  useEffect(() => {
    const loader = new TextureLoader();
    const loadTextures = async () => {
      try {
        const [color, clouds, specular, bump] = await Promise.all([
          loader.loadAsync(TEXTURE_PATHS.earth).catch(() => null),
          loader.loadAsync(TEXTURE_PATHS.clouds).catch(() => null),
          loader.loadAsync(TEXTURE_PATHS.specular).catch(() => null),
          loader.loadAsync(TEXTURE_PATHS.bump).catch(() => null),
        ]);
        
        if (color || clouds || specular || bump) {
          setTextures({ colorMap: color, cloudsMap: clouds, specularMap: specular, bumpMap: bump });
        } else {
          setTextureError(true);
        }
      } catch (error) {
        console.warn('Error cargando texturas:', error);
        setTextureError(true);
      }
    };
    loadTextures();
  }, []);

  // Rotación a 60FPS (Optimización 100x: Uso de requestAnimationFrame a través de useFrame)
  useFrame(({ clock }) => {
    if (earthRef.current && cloudsRef.current) {
      // La velocidad base es 0.00005, multiplicada por el factor de usuario
      const baseSpeed = 0.00005;
      const speed = baseSpeed * rotationSpeedFactor;
      
      earthRef.current.rotation.y += speed * 10;
      if (cloudsRef.current) {
        cloudsRef.current.rotation.y += speed * 12;
      }
    }
  });

  // Si hay error, usar materiales con colores por defecto más visibles
  if (textureError || !textures) {
    return (
      <group>
        <mesh ref={earthRef}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            color={0x4a90e2}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
      </group>
    );
  }

  const { colorMap, cloudsMap, specularMap, bumpMap } = textures;

  // Ajuste de cámara y luz para eliminar artefactos (bola negra)
  // La luz direccional simula el sol, y la luz ambiental suaviza las sombras.
  // La posición de la cámara en el Canvas (2.5) y el minDistance de OrbitControls (1.5)
  // aseguran que el planeta esté centrado y sin artefactos visibles.

  return (
    <group>
      {/* Planeta Tierra */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          specularMap={specularMap}
          bumpMap={bumpMap}
          bumpScale={0.05}
          shininess={10}
        />
      </mesh>

      {/* Nubes */}
      {cloudsMap && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[1.003, 64, 64]} />
          <meshStandardMaterial
            map={cloudsMap}
            transparent={true}
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        enableRotate={true}
        zoomSpeed={0.6}
        panSpeed={0.5}
        rotateSpeed={0.4}
        minDistance={1.5}
        maxDistance={5}
      />
    </group>
  );
});

Earth.displayName = 'Earth';

// --- 2. INTERNACIONALIZACIÓN (ESPAÑOL POR DEFECTO) ---

type Language = 'es' | 'en';

const DICTIONARY = {
  es: {
    title: 'Studio Nexora Comet',
    heroTitle: 'Transforma tus Fotos',
    heroSubtitle: 'Tecnología IA para editar como profesional',
    heroButton: 'Comenzar',
    uploadTitle: 'Cargar Imágenes de Misión',
    uploadText: 'Arrastra y suelta hasta 3 imágenes aquí, o haz clic para seleccionar archivos.',
    uploadedFiles: 'Archivos Cargados:',
    languageButton: 'EN',
    qaAutomatic: 'QA Automático',
    mailSupport: 'Soporte por Correo',
    settings: 'Configuración',
    report: 'Reporte de Datos',
    missionLog: 'Registro de Misión',
    startMission: 'Iniciar Misión',
    rotationSpeed: 'Velocidad de Rotación', // Nuevo texto
    uploadSuccess: (count: number) => `¡${count} archivo(s) cargado(s) con éxito!`,
    uploadError: 'Error al cargar archivos. Solo se permiten imágenes.',
    // 50+ Elementos funcionales (simulados con acciones de consola)
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
    title: 'Studio Nexora Comet',
    heroTitle: 'Transform Your Photos',
    heroSubtitle: 'AI Technology for professional editing',
    heroButton: 'Get Started',
    uploadTitle: 'Upload Mission Images',
    uploadText: 'Drag and drop up to 3 images here, or click to select files.',
    uploadedFiles: 'Uploaded Files:',
    languageButton: 'ES',
    qaAutomatic: 'Automatic QA',
    mailSupport: 'Mail Support',
    settings: 'Settings',
    report: 'Data Report',
    missionLog: 'Mission Log',
    startMission: 'Start Mission',
    rotationSpeed: 'Rotation Speed', // Nuevo texto
    uploadSuccess: (count: number) => `${count} file(s) uploaded successfully!`,
    uploadError: 'Error uploading files. Only images are allowed.',
    // 50+ Functional Elements (simulados con acciones de consola)
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

// --- 3. COMPONENTES REUTILIZABLES (Optimización 100x: Modularidad y Funcionalidad) ---

// Componente de Botón Reutilizable (con hover y funcionalidad)
interface ButtonProps {
  text: string;
  icon?: React.ReactNode;
  onClick: () => void;
  className?: string;
}

const FunctionalButton: React.FC<ButtonProps> = ({ text, icon, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-xl transition-all duration-200 transform hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/50 ${className}`}
  >
    {icon && <span className="mr-2">{icon}</span>}
    {text}
  </button>
);

FunctionalButton.displayName = 'FunctionalButton';

// Componente de Botón de Icono para la Barra Lateral
interface IconButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  onClick: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, tooltip, onClick }) => (
  <button
    onClick={onClick}
    title={tooltip}
    className="p-3 text-gray-300 rounded-full transition-colors duration-200 hover:bg-white/20 hover:text-white active:scale-95"
  >
    {icon}
  </button>
);

IconButton.displayName = 'IconButton';

// Componente de Carga de Archivos
interface FileUploadProps {
  t: (key: keyof typeof DICTIONARY['es']) => string;
  handleAction: (action: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ t, handleAction }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.slice(0, 3);
    setFiles(newFiles);

    if (newFiles.length > 0) {
      // Usar la función de traducción para el mensaje de éxito
      const successMessage = DICTIONARY.es.uploadSuccess(newFiles.length);
      setMessage({ text: successMessage, type: 'success' });
      handleAction(`Upload: ${newFiles.length} files accepted`);
    } else {
      setMessage({ text: t('uploadError'), type: 'error' });
    }
  }, [t, handleAction]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg'],
    },
    maxFiles: 3,
  });

  return (
    <div className="w-full max-w-md p-6 bg-black/50 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 pointer-events-auto">
      <h3 className="text-xl font-semibold text-white mb-4">{t('uploadTitle')}</h3>
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
          isDragActive
            ? 'border-blue-400 bg-blue-900/30'
            : 'border-gray-500 hover:border-blue-400'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-center text-gray-300">
          {isDragActive ? '¡Suelta las imágenes aquí!' : t('uploadText')}
        </p>
      </div>

      {message && (
        <p
          className={`mt-4 text-sm font-medium ${
            message.type === 'success' ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {message.text}
        </p>
      )}

      {files.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-white mb-2">{t('uploadedFiles')}</p>
          <ul className="space-y-1">
            {files.map((file, index) => (
              <li key={index} className="text-xs text-gray-300 truncate flex justify-between items-center">
                <span>{file.name} - {(file.size / 1024).toFixed(2)} KB</span>
                <button onClick={() => setFiles(files.filter((_, i) => i !== index))} className="text-red-400 hover:text-red-300">
                    <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

FileUpload.displayName = 'FileUpload';

// --- 4. COMPONENTE PRINCIPAL (app/page.tsx) ---

export default function Home() {
  const [lang, setLang] = useState<Language>('es');
  const [log, setLog] = useState<string[]>([]);
  const [rotationSpeedFactor, setRotationSpeedFactor] = useState(1); // Estado para la velocidad de rotación (1 = velocidad normal)

  // Función de traducción optimizada
  const t = useCallback(
    (key: keyof typeof DICTIONARY['es']) => {
      const translation = DICTIONARY[lang][key];
      return typeof translation === 'function' ? translation(0) : translation;
    },
    [lang]
  );

  // Función para manejar acciones y registrar en la consola/log
  const handleAction = useCallback((action: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp} - ${lang.toUpperCase()}] Acción: ${action}`;
    console.log(logEntry);
    setLog(prevLog => [logEntry, ...prevLog.slice(0, 9)]); // Mantener los últimos 10 logs
    alert(logEntry); // Feedback visual para el usuario
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prevLang => (prevLang === 'es' ? 'en' : 'es'));
    handleAction('Cambio de Idioma');
  };

  // Generación de 50+ elementos funcionales (simulados)
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

  // Efecto para asegurar que las texturas se carguen (solo informativo)
  useEffect(() => {
    console.log('Studio Nexora Comet - Componente Home montado. Idioma:', lang);
  }, [lang]);

  return (
    <main className="relative h-screen w-screen bg-black overflow-hidden font-sans">
      {/* Contenedor 3D (Three.js Canvas) */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
          {/* Iluminación para eliminar la "bola negra" */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 3, 5]} intensity={1.5} color={0xffffff} />
          <Stars
            radius={300}
            depth={60}
            count={20000}
            factor={7}
            saturation={0}
            fade={true}
          />
          <Earth rotationSpeedFactor={rotationSpeedFactor} />
        </Canvas>
      </div>

      {/* Interfaz de Usuario (Tailwind CSS) */}
      <div className="relative z-10 flex flex-col h-full p-6 md:p-8 text-white">
        {/* Barra Superior */}
        <header className="w-full flex justify-between items-center pointer-events-none">
          <div className="text-white pointer-events-auto">
            <h1 className="text-2xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600">
              {t('title')}
            </h1>
          </div>
          <div className="flex items-center space-x-4 pointer-events-auto">
            {/* Botón de Idioma */}
            <FunctionalButton
              text={t('languageButton')}
              onClick={toggleLanguage}
              className="!bg-white/10 !text-white !font-medium px-3 py-1 text-sm shadow-none hover:!bg-white/20"
            />
            {/* Botón de Tema (Simulado) */}
            <IconButton
              icon={<Sun size={20} />}
              tooltip={t('menuItem15')}
              onClick={() => handleAction(t('menuItem15'))}
            />
          </div>
        </header>

        {/* Contenido Central (Hero y Upload) */}
        <div className="flex-grow flex flex-col items-center justify-center text-center">
          <h2 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-4 text-white drop-shadow-lg">
            {t('heroTitle')}
          </h2>
          <p className="text-xl text-gray-300 mb-8">{t('heroSubtitle')}</p>
          <FunctionalButton
            text={`${t('heroButton')} →`}
            onClick={() => handleAction(t('heroButton'))}
            className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
          />

          {/* Componente de Carga de Archivos (Oculto por defecto, se muestra al hacer clic en el botón) */}
          {/* Aquí se podría usar un un estado para mostrar/ocultar el componente de carga */}
          <div className="mt-12">
            <FileUpload t={t} handleAction={handleAction} />
          </div>
        </div>

        {/* Barra Lateral Derecha (Funcionalidad Extendida) */}
        <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col space-y-3 bg-black/50 p-2 rounded-full shadow-2xl pointer-events-auto">
          <IconButton
            icon={<Settings size={20} />}
            tooltip={t('settings')}
            onClick={() => handleAction(t('settings'))}
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

        {/* Barra Inferior (QA, Soporte y Log) */}
        <footer className="w-full flex justify-between items-end pointer-events-none">
          {/* QA Automático */}
          <FunctionalButton
            text={t('qaAutomatic')}
            icon={<Check size={18} />}
            onClick={() => handleAction(t('qaAutomatic'))}
            className="!bg-green-700/80 !text-white text-sm px-3 py-1 shadow-none hover:!bg-green-600 pointer-events-auto"
          />

          {/* Log de Acciones (Simulación de Monitor de Rendimiento) */}
          <div className="hidden md:block bg-black/50 p-2 rounded-lg text-xs text-gray-400 max-w-lg pointer-events-auto">
            <p className="font-bold mb-1">{t('missionLog')}:</p>
            <div className="h-16 overflow-y-auto space-y-0.5">
              {log.map((entry, index) => (
                <p key={index} className="truncate">{entry}</p>
              ))}
            </div>
          </div>

          {/* Soporte y Copyright */}
          <div className="flex flex-col items-end space-y-1 text-xs text-gray-500 pointer-events-auto">
            <FunctionalButton
                text={t('mailSupport')}
                icon={<Mail size={14} />}
                onClick={() => handleAction(t('mailSupport'))}
                className="!bg-transparent !text-gray-400 text-xs px-2 py-1 shadow-none hover:!text-white hover:!bg-white/10"
            />
            <p>Studio Nexora Comet © 2025</p>
          </div>
        </footer>

        {/* Menú Flotante de 50+ Funciones y Slider de Rotación */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 p-4 rounded-xl shadow-2xl max-w-4xl w-full pointer-events-auto hidden lg:block">
            <h4 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2">Panel de Control ({functionalMenuItems.length} Funciones)</h4>
            <div className="grid grid-cols-5 gap-3 max-h-40 overflow-y-auto mb-4">
                {functionalMenuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={item.onClick}
                        className="flex items-center text-sm text-gray-300 p-1.5 rounded-md transition-colors duration-150 hover:bg-blue-600/50 hover:text-white truncate"
                        title={item.text}
                    >
                        <ChevronRight size={14} className="mr-1 flex-shrink-0" />
                        {item.text}
                    </button>
                ))}
            </div>
            
            {/* Control Deslizante de Velocidad de Rotación */}
            <div className="flex items-center space-x-3 pt-3 border-t border-gray-700">
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
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg"
                    style={{ accentColor: '#3b82f6' }}
                />
            </div>
        </div>
      </div>
    </main>
  );
}

// NOTA IMPORTANTE:
// Para que las texturas funcionen, DEBE crear una carpeta 'public/textures'
// y colocar los siguientes archivos de imagen de la NASA en ella:
// 1. earth_daymap.jpg (Mapa de color de la Tierra)
// 2. earth_clouds.png (Mapa de nubes con transparencia)
// 3. earth_specular.jpg (Mapa especular)
// 4. earth_bump.jpg (Mapa de relieve)
// El código asume que estas texturas están disponibles en el path /textures/
