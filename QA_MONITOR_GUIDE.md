# 🚀 QA MONITOR - Guía Completa

## 📋 Descripción

**QA Monitor** es el script único optimizado que verifica todo el proyecto Studio Nexora Comet, ejecuta tests E2E completos, genera reporte HTML visual y abre el reporte automáticamente.

## 🎯 Uso Rápido

### Ejecutar desde Terminal

**Linux/Mac:**
```bash
chmod +x qa-monitor.sh
./qa-monitor.sh
```

**Windows:**
```cmd
qa-monitor.bat
```

**O desde cualquier lugar del proyecto:**
```bash
# Linux/Mac
sh qa-monitor.sh

# Windows
qa-monitor.bat
```

## 🖥️ Crear Acceso Directo en Escritorio

### Windows

1. **Crear Acceso Directo:**
   - Click derecho en escritorio
   - "Nuevo" → "Acceso directo"
   - Buscar: `C:\estudio-nexora-comet\qa-monitor.bat`
   - Click "Siguiente"

2. **Personalizar:**
   - Nombre: "QA Nexora Comet (Monitor)"
   - Click "Finalizar"

3. **Cambiar Icono (Opcional):**
   - Click derecho en el acceso directo
   - "Propiedades"
   - Click "Cambiar icono"
   - Seleccionar icono personalizado (puedes usar logo del planeta, Copilot, etc.)

### Linux

1. **Crear Acceso Directo:**
   ```bash
   # Hacer ejecutable
   chmod +x qa-monitor.sh
   
   # Crear symlink en escritorio
   ln -s /ruta/completa/al/proyecto/qa-monitor.sh ~/Desktop/qa-monitor
   ```

2. **O crear archivo .desktop:**
   ```bash
   # Crear archivo
   nano ~/Desktop/qa-monitor.desktop
   
   # Contenido:
   [Desktop Entry]
   Name=QA Nexora Comet (Monitor)
   Exec=/ruta/completa/al/proyecto/qa-monitor.sh
   Icon=/ruta/al/icono.png
   Type=Application
   Terminal=true
   ```

### Mac

1. **Crear Acceso Directo:**
   ```bash
   # Hacer ejecutable
   chmod +x qa-monitor.sh
   
   # Crear alias en escritorio
   osascript -e 'tell application "Finder" to make alias file to POSIX file "/ruta/completa/al/proyecto/qa-monitor.sh" at desktop'
   ```

2. **O usar Automator:**
   - Abrir Automator
   - Crear nueva "Aplicación"
   - Agregar acción "Ejecutar script de shell"
   - Pegar: `/ruta/completa/al/proyecto/qa-monitor.sh`
   - Guardar como "QA Nexora Comet Monitor.app"
   - Mover a escritorio

## 📊 Qué Hace el Script

### 1. Verificación Inicial
- ✅ Verifica que estás en la raíz del proyecto (`package.json` existe)
- ✅ Verifica que `node_modules` existe (instala si falta)

### 2. Tests E2E Completos
- ✅ Ejecuta `npm run test:e2e:full`
- ✅ Prueba todos los botones y funciones
- ✅ Verifica flujos completos (upload, AI, payment, etc.)

### 3. Generación de Reporte
- ✅ Ejecuta `npm run test:report`
- ✅ Genera reporte HTML visual en `cypress/reports/html/mochawesome.html`
- ✅ Incluye screenshots, videos y detalles de cada test

### 4. Apertura Automática
- ✅ Abre el reporte HTML en el navegador automáticamente
- ✅ Permite revisar visualmente todos los resultados

## 📋 Checklist Post-Ejecución

Después de ejecutar QA Monitor, verifica:

- [ ] Todos los tests pasaron (verde en el reporte)
- [ ] No hay errores críticos
- [ ] Screenshots muestran UI correcta
- [ ] Todos los flujos funcionan (upload, AI, payment, etc.)
- [ ] Widgets flotantes funcionan (Earth, Copilot, QA, Theme)
- [ ] Onboarding modal aparece correctamente
- [ ] Tooltips funcionan
- [ ] Keyboard shortcuts funcionan

## 🚀 Próximos Pasos

Si todo está bien:

```bash
# Opción 1: Push automatizado
./push-to-production.sh  # o push-to-production.bat

# Opción 2: Push manual
git add .
git commit -m "QA 1000x Nexora Comet passed, listo para producción"
git push origin main
```

## 🐛 Troubleshooting

### Script No Ejecuta

**Linux/Mac:**
```bash
# Verificar permisos
chmod +x qa-monitor.sh

# Verificar que está en la raíz del proyecto
ls package.json
```

**Windows:**
```cmd
# Verificar que el archivo existe
dir qa-monitor.bat
```

### Tests Fallan

1. Verificar que Cypress está instalado:
   ```bash
   npm list cypress
   ```

2. Verificar configuración:
   ```bash
   cat cypress.config.ts
   ```

3. Ejecutar tests individuales:
   ```bash
   npm run test:ai-flow
   npm run test:bilingual
   ```

### Reporte No Se Abre

1. Verificar que el reporte existe:
   ```bash
   ls cypress/reports/html/mochawesome.html
   ```

2. Abrir manualmente:
   - Navegar a `cypress/reports/html/`
   - Abrir `mochawesome.html` en navegador

## 📚 Archivos Relacionados

- `qa-monitor.sh` - Script principal (Linux/Mac)
- `qa-monitor.bat` - Script principal (Windows)
- `run-qa.sh` / `run-qa.bat` - Script alternativo más simple
- `check-all.sh` / `check-all.bat` - Revisión completa sin tests
- `push-to-production.sh` / `push-to-production.bat` - Push automatizado

## ✅ Resumen

**QA Monitor** es tu herramienta principal para:
- ✅ Verificar que todo funciona antes de hacer push
- ✅ Generar reportes visuales de QA
- ✅ Asegurar calidad antes de producción
- ✅ Detectar problemas temprano

**Úsalo siempre antes de hacer push a producción!**

---

**Última actualización:** 2024
**Versión:** 1.0.0

