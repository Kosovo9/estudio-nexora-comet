# 🖥️ Crear Acceso Directo QA en Windows

## 📋 Pasos para Crear el Acceso Directo

### 1️⃣ Verificar el Script

El archivo `qa-monitor.bat` ya está creado en la raíz del proyecto:
```
C:\estudio-nexora-comet\qa-monitor.bat
```

### 2️⃣ Crear Acceso Directo en el Escritorio

#### Opción A: Desde el Explorador de Archivos

1. **Abre el Explorador de Archivos**
   - Presiona `Win + E`

2. **Navega a la raíz del proyecto**
   - Ve a: `C:\estudio-nexora-comet`

3. **Busca el archivo `qa-monitor.bat`**
   - Haz click derecho sobre `qa-monitor.bat`
   - Selecciona **"Crear acceso directo"**

4. **Mover al escritorio**
   - El acceso directo se creará en la misma carpeta
   - Arrástralo al escritorio o cópialo (`Ctrl + C`) y pégalo en el escritorio (`Ctrl + V`)

5. **Renombrar (opcional)**
   - Click derecho en el acceso directo → **"Cambiar nombre"**
   - Nombra: `QA Nexora Comet`

#### Opción B: Crear Manualmente

1. **Click derecho en el escritorio**
   - Selecciona **"Nuevo"** → **"Acceso directo"**

2. **En "Ubicación del elemento"**, escribe:
   ```
   C:\estudio-nexora-comet\qa-monitor.bat
   ```
   O haz click en **"Examinar"** y navega hasta el archivo.

3. **Click en "Siguiente"**

4. **Nombra el acceso directo:**
   ```
   QA Nexora Comet
   ```

5. **Click en "Finalizar"**

### 3️⃣ Personalizar el Icono (Opcional)

1. **Click derecho en el acceso directo** → **"Propiedades"**

2. **Click en "Cambiar icono"**

3. **Elige un icono:**
   - Puedes usar iconos del sistema Windows
   - O buscar un archivo `.ico` personalizado

4. **Click en "Aceptar"** → **"Aplicar"** → **"Aceptar"**

### 4️⃣ Probar el Acceso Directo

1. **Doble click en el acceso directo** `QA Nexora Comet`

2. **Se abrirá una ventana CMD que:**
   - Ejecutará todos los tests E2E
   - Generará el reporte HTML
   - Abrirá automáticamente el reporte en el navegador

3. **El reporte se abrirá en:**
   ```
   cypress\reports\html\mochawesome.html
   ```

## 🎯 Funcionalidades del Script

El script `qa-monitor.bat` ejecuta:

1. ✅ **Tests E2E completos** (`npm run test:e2e:full`)
   - Tests de todos los flujos
   - Detección de bloqueos AI
   - Tests bilingües
   - Tests de analytics
   - Tests de SEO y accesibilidad
   - Tests mobile responsive

2. ✅ **Generación de reporte** (`npm run test:report`)
   - Reporte HTML visual
   - Métricas detalladas
   - Screenshots de errores

3. ✅ **Apertura automática del reporte**
   - Se abre en el navegador predeterminado
   - Listo para revisar resultados

## 📝 Notas

- **Ruta del proyecto:** `C:\estudio-nexora-comet`
- **Script:** `qa-monitor.bat`
- **Reporte:** `cypress\reports\html\mochawesome.html`

## 🔧 Troubleshooting

### Error: "No se encontró package.json"
- Verifica que el script esté en la raíz del proyecto
- Asegúrate de que la ruta en el acceso directo sea correcta

### Error: "npm no se reconoce"
- Instala Node.js desde: https://nodejs.org/
- Reinicia la terminal después de instalar

### El reporte no se abre automáticamente
- Busca manualmente en: `cypress\reports\html\mochawesome.html`
- O ejecuta: `start cypress\reports\html\mochawesome.html`

## ✅ Checklist

- [x] Script `qa-monitor.bat` creado
- [ ] Acceso directo creado en escritorio
- [ ] Icono personalizado (opcional)
- [ ] Script probado y funcionando

---

**¡Listo!** Ahora tienes un acceso directo en tu escritorio para ejecutar QA con un solo click.

