// ============================================================================================================
// INSTRUCCIONES DE OPTIMIZACIÓN FINAL Y VISUALIZACIÓN ESPACIAL 100X REAL PARA CURSOR AI AGENT
// PROYECTO: estudio-nexora-comet
// ============================================================================================================

// OBJETIVO: Consolidar todas las tareas pendientes, implementar renderizado 3D hiperrealista de la Tierra y el espacio,
// generar reportes solicitados, y realizar despliegue completo hasta producción.

// ============================================================================================================
// TAREA 1: IDENTIFICACIÓN DE VARIABLES DE ENTORNO CRÍTICAS (REPORTE AL USUARIO)
// ============================================================================================================

// ACCIÓN: Analiza todos los archivos del proyecto en busca de referencias a 'process.env'.
// Prioriza archivos: lib/stripe.ts, lib/supabase.ts, app/api/**/*.ts, app/layout.tsx

// VARIABLES CRÍTICAS A IDENTIFICAR Y REPORTAR:
// 1. CLERK_SECRET_KEY - Clave secreta para autenticación (Server-Side)
// 2. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY - Clave pública Clerk (Client-Side)
// 3. STRIPE_SECRET_KEY - Clave secreta Stripe (Server-Side)
// 4. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY - Clave pública Stripe (Client-Side)
// 5. NEXT_PUBLIC_SUPABASE_URL - URL de Supabase (Client-Side)
// 6. NEXT_PUBLIC_SUPABASE_ANON_KEY - Clave anónima Supabase (Client-Side)
// 7. NEXT_PUBLIC_GOOGLE_AI_API_KEY - Clave API Google AI (Client-Side)
// 8. STRIPE_WEBHOOK_SECRET - Secreto para webhooks Stripe (Server-Side)
// 9. NEXT_PUBLIC_APP_URL - URL base de la aplicación (Client-Side)

// REPORTE REQUERIDO: Genera una lista formateada con estas variables y muéstrala al usuario.
// Formato: "Variable | Propósito | Tipo (Server/Client) | Crítica (Sí/No)"

// ============================================================================================================
// TAREA 2: FRAGMENTO DE CÓDIGO DE ROTACIÓN (REPORTE AL USUARIO)
// ============================================================================================================

// ACCIÓN: Localiza el componente 'components/Earth3D.tsx' y encuentra el fragmento exacto que implementa la rotación.

// FRAGMENTO ESPERADO (para referencia):
// - Debe usar 'useFrame' de '@react-three/fiber'
// - Debe incrementar 'rotation.y' de los refs 'earthRef' y 'cloudsRef'
// - Velocidad actual: baseSpeed * rotationSpeedFactor

// REPORTE REQUERIDO: Muestra el fragmento de código completo (líneas 56-65 aproximadamente) al usuario.

// ============================================================================================================
// TAREA 3: CORRECCIÓN DE UI Y FOOTER (IMPLEMENTACIÓN)
// ============================================================================================================

// 3.1. LIMPIEZA DE HERRAMIENTAS DE DESARROLLO
// - Verifica que 'components/QAWidget.tsx' tenga la condición: if (process.env.NODE_ENV === 'production') return null
// - Verifica que 'app/page.tsx' tenga el botón QA envuelto en: {process.env.NODE_ENV !== 'production' && (...)}
// - Verifica que 'app/globals.css' tenga los estilos para ocultar Vercel Toolbar:
//   .vc-toolbar, [data-vercel-toolbar], #vercel-toolbar { display: none !important; }

// 3.2. CORRECCIÓN DE EMPALME EN FOOTER
// - Archivo: 'app/page.tsx' (líneas 226-257 aproximadamente)
// - Problema: El botón de chat y el texto del footer se superponen
// - Solución: Ajusta el padding/margin del footer y verifica que el botón de chat esté en 'bottom-20' (ya corregido)
// - Asegura que el footer use Flexbox correctamente: 'flex flex-col sm:flex-row justify-between items-center gap-4'

// ============================================================================================================
// TAREA 4: IMPLEMENTACIÓN DE VISUALIZACIÓN ESPACIAL HIPERREALISTA (100X REAL)
// ============================================================================================================

// 4.1. MEJORA DEL COMPONENTE 'Earth3D.tsx' (components/Earth3D.tsx)

// TEXTURAS NASA (Ya están en public/textures/):
// - earth_daymap.jpg - Mapa de color de la Tierra (continentes y océanos)
// - earth_clouds.png - Mapa de nubes con transparencia
// - earth_specular.jpg - Mapa especular (brillo del agua en océanos)
// - earth_bump.jpg - Mapa de relieve (profundidad de continentes)

// IMPLEMENTACIÓN REQUERIDA:

// A. CARGA DE TEXTURAS (Mejorar el manejo de errores):
//    - Mantener el código actual de carga asíncrona
//    - Agregar retry logic si las texturas fallan
//    - Asegurar que las texturas se repiten correctamente (wrapS, wrapT)

// B. ROTACIÓN CONTINUA (Optimizar):
//    - Velocidad base: 0.0005 (ya está correcto)
//    - Dirección: De izquierda a derecha (eje Y positivo) ✅
//    - Nubes: Rotar ligeramente más rápido (1.2x) para efecto atmosférico ✅
//    - Asegurar que la rotación sea suave y constante en todos los frames

// C. ILUMINACIÓN REALISTA (Mejorar):
//    - DirectionalLight: Simular el sol
//      - Posición: [5, 3, 5] (ya está)
//      - Intensidad: 1.5 (ya está)
//      - Color: 0xffffff (blanco, correcto)
//    - AmbientLight: Iluminación ambiental muy tenue para el lado oscuro
//      - Intensidad: 0.3 (reducir de 0.5 a 0.3 para mayor contraste día/noche)
//    - Agregar PointLight opcional para efecto de "glow" en el terminador (línea día/noche)

// D. MATERIALES FOTOREALISTAS:
//    - Tierra: meshPhongMaterial con:
//      - map: colorMap ✅
//      - specularMap: specularMap ✅ (brillo del agua)
//      - bumpMap: bumpMap ✅ (relieve)
//      - bumpScale: 0.1 (aumentar de 0.05 a 0.1 para más profundidad)
//      - shininess: 30 (aumentar de 10 a 30 para océanos más brillantes)
//      - specular: 0x222222 (color especular sutil)
//    - Nubes: meshStandardMaterial con:
//      - map: cloudsMap ✅
//      - transparent: true ✅
//      - opacity: 0.6 (reducir de 0.8 a 0.6 para nubes más sutiles)
//      - blending: THREE.AdditiveBlending ✅
//      - emissive: 0xffffff (nubes ligeramente luminosas)
//      - emissiveIntensity: 0.2

// E. GEOMETRÍA DE ALTA RESOLUCIÓN:
//    - Tierra: sphereGeometry args={[1, 128, 128]} (aumentar de 64 a 128 para más detalle)
//    - Nubes: sphereGeometry args={[1.003, 128, 128]} (mismo detalle)

// 4.2. IMPLEMENTACIÓN DE FONDO ESTELAR HIPERREALISTA (Mejorar componente Stars)

// ARCHIVO: components/Earth3D.tsx (líneas 128-135)

// MEJORAS REQUERIDAS:
// - Aumentar count de 20000 a 50000 (campo estelar más denso)
// - Agregar variación de tamaño: usar 'size' prop si está disponible en drei
// - Agregar variación de brillo: usar 'fade' con diferentes intensidades
// - Profundidad: Aumentar 'depth' de 60 a 100 para efecto de paralaje más pronunciado
// - Radio: Aumentar 'radius' de 300 a 500 para cubrir más área
// - Saturation: Mantener en 0 (estrellas blancas/azules)

// CÓDIGO OPTIMIZADO PARA Stars:
// <Stars
//   radius={500}
//   depth={100}
//   count={50000}
//   factor={10}
//   saturation={0}
//   fade={true}
//   speed={0.5}
// />

// 4.3. EFECTOS ADICIONALES (Opcional pero recomendado):
// - Agregar efecto de "atmosphere" (glow azul alrededor de la Tierra)
//   - Usar un RingGeometry o una esfera ligeramente más grande con material transparente
//   - Color: 0x4a90e2 (azul atmosférico)
//   - Opacity: 0.1-0.2
// - Agregar efecto de "lens flare" cuando el sol está visible (opcional, puede ser pesado)

// ============================================================================================================
// TAREA 5: RESUMEN DE 3 PUNTOS CLAVE PARA VERIFICACIÓN EN VERCEL (REPORTE AL USUARIO)
// ============================================================================================================

// GENERA UN RESUMEN DE 3 PUNTOS CLAVE:

// PUNTO 1: Verificación de Build
// - El despliegue debe estar en estado "Ready" (no "Building" o "Failed")
// - Revisar Build Logs para asegurar que no hay errores de compilación
// - Verificar que las texturas se cargan correctamente (no errores 404)

// PUNTO 2: Verificación de Funcionalidad
// - La Tierra debe girar suavemente de izquierda a derecha
// - Las estrellas deben ser visibles en el fondo oscuro con diferentes tamaños/brillos
// - No deben aparecer elementos de desarrollo (QA, Vercel Toolbar)
// - El footer no debe tener empalmes

// PUNTO 3: Verificación de Rendimiento
// - La aplicación debe cargar en menos de 3 segundos
// - No debe haber errores en la consola del navegador (F12)
// - El componente 3D debe renderizar a 60 FPS (verificar con DevTools Performance)

// ============================================================================================================
// FINALIZACIÓN Y DESPLIEGUE COMPLETO
// ============================================================================================================

// PASO 1: Verificar que todos los cambios estén guardados
// - Ejecuta: git status
// - Asegura que todos los archivos modificados estén listos para commit

// PASO 2: Crear commit único con mensaje descriptivo
// git add .
// git commit -m "feat: Optimización 100x Real - Visualización espacial hiperrealista y correcciones finales" -m "- Implementación de texturas NASA con materiales fotorrealistas" -m "- Rotación continua optimizada de izquierda a derecha" -m "- Fondo estelar mejorado con 50,000 estrellas de diferentes tamaños" -m "- Iluminación realista con contraste día/noche mejorado" -m "- Corrección de empalmes en footer y limpieza de herramientas de desarrollo" -m "- Reporte de variables de entorno críticas generado"

// PASO 3: Push a GitHub
// git push origin main

// PASO 4: Verificar que Vercel detecte los cambios
// - Esperar 2-5 minutos
// - Verificar en Vercel Dashboard que el nuevo despliegue esté en proceso

// ============================================================================================================
// NOTAS IMPORTANTES PARA EL AGENTE
// ============================================================================================================

// 1. NO eliminar código existente sin verificar su propósito
// 2. Las texturas YA están en public/textures/ (no moverlas)
// 3. Mantener compatibilidad con el slider de velocidad de rotación existente
// 4. Asegurar que los cambios no rompan la funcionalidad existente
// 5. Probar localmente con 'npm run build' antes de hacer push
// 6. Si hay errores de build, corregirlos antes de commit

// ============================================================================================================
// FIN DE INSTRUCCIONES
// ============================================================================================================

