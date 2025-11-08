# ⚡ VERIFICACIÓN RÁPIDA - Studio Nexora Comet

## 🚀 QA MONITOR - Script Único

### Ejecutar QA Monitor (Recomendado)

**Linux/Mac:**
```bash
chmod +x qa-monitor.sh
./qa-monitor.sh
```

**Windows:**
```cmd
qa-monitor.bat
```

**O desde cualquier lugar:**
```bash
# Linux/Mac
sh qa-monitor.sh

# Windows
qa-monitor.bat
```

Este script único ejecuta:
- ✅ Tests E2E completos
- ✅ Genera reporte HTML
- ✅ Abre reporte automáticamente

### Crear Acceso Directo Desktop

1. Click derecho en escritorio → "Nuevo" → "Acceso directo"
2. Apuntar a: `qa-monitor.sh` (Linux/Mac) o `qa-monitor.bat` (Windows)
3. Nombre: "QA Nexora Comet (Monitor)"
4. Doble click para ejecutar

## 🚀 Comandos Rápidos

### 1. Revisión Completa (5 minutos)
```bash
# Linux/Mac
./check-all.sh

# Windows
check-all.bat
```

### 2. Push a Producción (Automático)
```bash
# Linux/Mac
./push-to-production.sh

# Windows
push-to-production.bat
```

### 3. QA Runner (Desktop Shortcut)
```bash
# Linux/Mac - Crear shortcut apuntando a:
./run-qa.sh

# Windows - Crear shortcut apuntando a:
run-qa.bat
```

## ✅ Checklist Rápido (30 segundos)

Antes de hacer push, verifica:

- [ ] `npm run lint` - Sin errores críticos
- [ ] `npm run build` - Build exitoso
- [ ] `.env.local` - Todas las claves configuradas
- [ ] Git status - Cambios commitados
- [ ] Tests opcionales - `npm run test:e2e:full`

## 📤 Push Rápido

```bash
git add .
git commit -m "feat: Studio Nexora Comet updates"
git push origin main
```

## 🌐 Verificar Deploy

1. Ve a: https://vercel.com/dashboard
2. Revisa último deployment
3. Abre: https://studio-nexora.com
4. Verifica widgets flotantes funcionan

## 🎯 Widgets a Verificar

- [ ] 🌍 Earth (top-left)
- [ ] 🤖 Copilot (bottom-right)
- [ ] ✅ QA (bottom-left)
- [ ] 🌓 Theme Toggle (top-right)
- [ ] 📋 Onboarding Modal (primera visita)

---

**Todo listo?** → `./push-to-production.sh` o `push-to-production.bat`

