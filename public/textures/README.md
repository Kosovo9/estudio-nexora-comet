# Texturas de la Tierra - NASA

Esta carpeta debe contener las texturas de la Tierra de la NASA para que el componente 3D funcione correctamente.

## Archivos Requeridos

1. **earth_daymap.jpg** - Mapa de color de la Tierra (NASA Blue Marble)
   - Fuente: https://visibleearth.nasa.gov/view_cat.php?categoryID=1484
   - Resolución recomendada: 8K o 16K para mejor calidad

2. **earth_clouds.png** - Mapa de nubes con transparencia (NASA Cloud Cover)
   - Fuente: https://visibleearth.nasa.gov/view_cat.php?categoryID=1484
   - Debe tener canal alpha para transparencia

3. **earth_specular.jpg** - Mapa especular (reflejos de agua)
   - Fuente: NASA Water Mask o generado desde Blue Marble
   - Indica áreas de agua para reflejos

4. **earth_bump.jpg** - Mapa de relieve/topografía (NASA Topography)
   - Fuente: https://visibleearth.nasa.gov/view_cat.php?categoryID=1484
   - Mapa de elevación para dar profundidad

## Instrucciones de Descarga

1. Visita los enlaces de NASA Visible Earth
2. Descarga las texturas en la resolución más alta disponible (8K o 16K)
3. Guarda los archivos con los nombres exactos indicados arriba
4. Coloca todos los archivos en esta carpeta: `public/textures/`

## Nota

Si las texturas no están disponibles, Three.js usará colores por defecto (negro/gris), lo que resultará en una esfera sin detalles. Las texturas son esenciales para el efecto visual realista.

## Alternativas

Si no puedes descargar las texturas de la NASA, puedes:
- Usar texturas procedimentales generadas
- Descargar texturas de la Tierra de otras fuentes (asegúrate de que tengan licencia apropiada)
- Usar texturas de menor resolución temporalmente

