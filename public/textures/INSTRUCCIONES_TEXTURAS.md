# 🌍 Texturas de la Tierra - Instrucciones de Instalación

## ⚠️ IMPORTANTE: Sin estas texturas, la aplicación mostrará una pantalla negra

## 📁 Archivos Requeridos

Debes colocar los siguientes 4 archivos en esta carpeta (`public/textures/`):

1. **earth_daymap.jpg** - Mapa de color de la Tierra (NASA Blue Marble)
2. **earth_clouds.png** - Mapa de nubes con transparencia (NASA Cloud Cover)
3. **earth_specular.jpg** - Mapa especular para reflejos de agua
4. **earth_bump.jpg** - Mapa de relieve/topografía (NASA Topography)

## 🔗 Fuentes para Descargar las Texturas

### Opción 1: NASA Visible Earth (Recomendado)
- **URL**: https://visibleearth.nasa.gov/view_cat.php?categoryID=1484
- Busca "Blue Marble" para el mapa de color
- Busca "Cloud Cover" para las nubes
- Busca "Topography" para el mapa de relieve

### Opción 2: Texturas Procedimentales
Si no puedes descargar las texturas de la NASA, puedes:
- Usar texturas procedimentales generadas
- Descargar texturas de la Tierra de otras fuentes (asegúrate de que tengan licencia apropiada)
- Usar texturas de menor resolución temporalmente

## 📝 Pasos para Agregar las Texturas

1. Descarga los 4 archivos de textura
2. Colócalos en esta carpeta: `public/textures/`
3. Asegúrate de que los nombres sean exactamente:
   - `earth_daymap.jpg`
   - `earth_clouds.png`
   - `earth_specular.jpg`
   - `earth_bump.jpg`
4. Haz commit y push a GitHub:
   ```bash
   git add public/textures/*.jpg public/textures/*.png
   git commit -m "feat: Agregar texturas de la Tierra"
   git push origin main
   ```
5. Vercel desplegará automáticamente los cambios

## ⚠️ Nota sobre Tamaño de Archivos

Las texturas pueden ser grandes (varios MB cada una). Si GitHub rechaza archivos grandes:
- Usa Git LFS: `git lfs track "*.jpg" "*.png"`
- O usa texturas de menor resolución (2K en lugar de 8K/16K)

## ✅ Verificación

Una vez agregadas las texturas, la aplicación debería:
- Mostrar la Tierra 3D correctamente
- No mostrar pantalla negra
- Permitir rotación y zoom interactivo

