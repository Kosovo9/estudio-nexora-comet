// Internationalization (i18n) - Bilingual Support

export type Language = 'es' | 'en'

export const languageTexts = {
  en: {
    generating: 'Generating your photo, please wait...',
    downloading: 'Please confirm you want to download. The image will not be saved after download.',
    downloadDisclaimer: 'Disclaimer: By downloading, you accept full responsibility. Images are deleted after 24 hours for privacy/security.',
    error: 'There was a problem generating the photo. Try again.',
    timeout: 'Your photo is taking too long. Check your connection or try later.',
    timeoutLong: 'Generation is running late. Please try again or contact support.',
    success: 'Your photo is ready!',
    download: 'Download Photo',
    timer: 'Elapsed time:',
    confirmDownload: 'Are you sure you want to download? The photo won\'t be stored.',
    almostReady: 'Almost ready, keep waiting...',
    generationTimeDisclaimer: 'This may take 10-20 seconds. Please do not close this page.',
    tipGenerationTime: 'Tip: Generation usually takes 12-20 seconds',
    tipStableConnection: 'Tip: Ensure you have a stable connection',
    generationSuccess: 'Generation completed successfully!',
    generateImageAI: 'Generate AI Image',
    style: 'Style',
    uploadPhotos: 'Upload Photos',
    consent: 'Consent & Authorization',
    selectStyle: 'Select Style',
    readyToGenerate: 'Ready to Generate',
    watermarkPreview: 'Watermark Preview',
    payment: 'Complete Payment',
    darkStudio: 'Dark Studio',
    parisCafe: 'Paris Café',
    continue: 'Continue',
    back: 'Back',
    submit: 'Submit',
    cancel: 'Cancel',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    logout: 'Sign Out',
    needHelp: 'Need help?',
    contactSupport: 'Contact Support',
    chatSupport: 'Chat Support',
    emailSupport: 'Email Support',
    downloadAvailable: 'Download available for 24 hours',
    downloadAvailableFull: '⚠️ Download available for 24 hours / Descarga disponible por 24 horas',
  },
  es: {
    generating: 'Generando tu foto, espera por favor...',
    downloading: 'Confirma que deseas descargar. La imagen no se guardará después de descargarla.',
    downloadDisclaimer: 'Aviso legal: Al descargar, aceptas toda la responsabilidad. Las imágenes se eliminan tras 24 horas por privacidad/seguridad.',
    error: 'Hubo un problema generando la foto. Intenta nuevamente.',
    timeout: 'Tu foto está tardando demasiado. Verifica tu conexión o intenta después.',
    timeoutLong: 'La generación está tardando. Intenta de nuevo o contacta soporte.',
    success: '¡Tu foto está lista!',
    download: 'Descargar Foto',
    timer: 'Tiempo transcurrido:',
    confirmDownload: '¿Estás seguro que quieres descargar? La foto no se guardará.',
    almostReady: 'Casi está listo, espera...',
    generationTimeDisclaimer: 'Esto puede tomar entre 10-20 segundos. Por favor, no cierres esta página.',
    tipGenerationTime: '💡 Tip: La generación normalmente toma 12-20 segundos',
    tipStableConnection: '💡 Tip: Asegúrate de tener una conexión estable',
    generationSuccess: '¡Generación completada exitosamente!',
    generateImageAI: 'Generar Imagen AI',
    style: 'Estilo',
    uploadPhotos: 'Subir Fotos',
    consent: 'Consentimiento y Autorización',
    selectStyle: 'Seleccionar Estilo',
    readyToGenerate: 'Listo para Generar',
    watermarkPreview: 'Vista Previa con Marca de Agua',
    payment: 'Completar Pago',
    darkStudio: 'Estudio Oscuro',
    parisCafe: 'Café Parisino',
    continue: 'Continuar',
    back: 'Atrás',
    submit: 'Enviar',
    cancel: 'Cancelar',
    signIn: 'Iniciar Sesión',
    signUp: 'Registrarse',
    logout: 'Cerrar Sesión',
    needHelp: '¿Necesitas ayuda?',
    contactSupport: 'Contactar Soporte',
    chatSupport: 'Chat de Soporte',
    emailSupport: 'Soporte por Email',
    downloadAvailable: 'Descarga disponible por 24 horas',
    downloadAvailableFull: '⚠️ Descarga disponible por 24 horas / Download available for 24 hours',
  },
}

export function getLanguage(): Language {
  if (typeof window === 'undefined') return 'en'
  
  // Check URL parameter
  const params = new URLSearchParams(window.location.search)
  const langParam = params.get('lang') as Language
  if (langParam && (langParam === 'es' || langParam === 'en')) {
    localStorage.setItem('preferred-language', langParam)
    return langParam
  }
  
  // Check localStorage
  const stored = localStorage.getItem('preferred-language') as Language
  if (stored && (stored === 'es' || stored === 'en')) {
    return stored
  }
  
  // Check browser language
  const browserLang = navigator.language.split('-')[0]
  return browserLang === 'es' ? 'es' : 'en'
}

export function setLanguage(lang: Language) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferred-language', lang)
  }
}

export function getTexts(lang?: Language) {
  const currentLang = lang || getLanguage()
  return languageTexts[currentLang]
}

