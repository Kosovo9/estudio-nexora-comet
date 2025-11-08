# 🚀 Scripts de Fixes Optimizados 10x - Studio Nexora Comet

## ⚡ Uso Rápido (Desde la raíz del proyecto)

```powershell
# 1. Navega a la carpeta del proyecto
cd C:\estudio-nexora-comet

# 2. Ejecuta el script que necesites:

# Opción A: Fix completo (recomendado) - ~30s
powershell -ExecutionPolicy Bypass -File fix-all.ps1

# Opción B: Fix rápido (solo críticos) - ~5s
powershell -ExecutionPolicy Bypass -File quick-fix.ps1

# Opción C: One-liner (máxima velocidad) - ~3s
powershell -ExecutionPolicy Bypass -File fix-one-liner.ps1
```

## 🎯 ¿Desde qué carpeta ejecutar?

**SIEMPRE desde la raíz del proyecto** (donde está `package.json`):

```powershell
# Verifica que estás en la carpeta correcta:
ls package.json

# Si ves "package.json", estás en el lugar correcto ✅
# Si no, navega primero:
cd C:\estudio-nexora-comet
```

## 📋 Qué hace cada script

### `fix-all.ps1` (Completo - ~30s)
- ✅ Limpieza paralela de caché (.next, build, dist, reports, node_modules\.cache)
- ✅ Verifica raíz del proyecto (package.json)
- ✅ Fixes automáticos de Cypress (tipado, onUncaughtException)
- ✅ Verifica dependencias (npm install si falta)
- ✅ Muestra scripts NPM disponibles
- ✅ Build check rápido (solo errores críticos)
- ✅ Resumen con tiempo de ejecución

### `quick-fix.ps1` (Rápido - ~5s)
- ✅ Limpieza paralela de caché básica
- ✅ Fixes críticos de Cypress (tipado win/$el, onUncaughtException)
- ⚡ Máxima velocidad, mínimo output

### `fix-one-liner.ps1` (Ultra-rápido - ~3s)
- ✅ Mismo que quick-fix pero en formato compacto
- ⚡ Para usuarios avanzados que quieren máxima velocidad

## 🔧 Fixes Aplicados Automáticamente

1. **Tipado de `win`**: `(win)` → `(win: any)`
2. **Tipado de `$el`**: `($el)` → `($el: any)`
3. **onUncaughtException**: Reemplazado por `failOnStatusCode: false`
4. **Método `.or()`**: Detectado y marcado para revisión manual

## 📝 Después de los fixes

```powershell
# 1. Verificar que compile
npm run build

# 2. Ejecutar tests
npm run test:e2e

# 3. Si todo está bien, commit
git add .
git commit -m "fix: Cypress syntax errors and typing"
git push origin main
```

## ⚠️ Notas

- Los scripts se ejecutan desde la **raíz del proyecto** (donde está `package.json`)
- Si ves errores de permisos, ejecuta PowerShell como Administrador
- Los fixes son **no destructivos** (solo cambian lo necesario)

