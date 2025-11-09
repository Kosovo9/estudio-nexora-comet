/**
 * Script de diagnóstico - Encontrar elementos con fondo blanco
 * Ejecutar en consola del navegador para diagnóstico
 */

const diagnosticScript = () => {
    // Encontrar elementos con fondo blanco
    const whiteElements = [];
    
    document.querySelectorAll('*').forEach(el => {
        const styles = window.getComputedStyle(el);
        const bg = styles.backgroundColor;
        const rect = el.getBoundingClientRect();
        
        if ((bg.includes('255, 255, 255') || bg === 'white' || bg === '#ffffff' || bg === 'rgb(255, 255, 255)') && 
            rect.width > 100 && rect.height > 100) {
            whiteElements.push({
                element: el,
                tag: el.tagName,
                class: el.className,
                id: el.id,
                bgColor: bg,
                size: {width: rect.width, height: rect.height},
                position: {
                    top: rect.top,
                    left: rect.left,
                    right: rect.right,
                    bottom: rect.bottom
                }
            });
        }
    });
    
    console.log('🎯 ELEMENTOS CON FONDO BLANCO:', whiteElements);
    console.table(whiteElements.map(e => ({
        Tag: e.tag,
        Class: e.class,
        ID: e.id,
        'Background': e.bgColor,
        'Size': `${e.size.width}x${e.size.height}`,
        'Position': `(${e.position.left}, ${e.position.top})`
    })));
    
    return whiteElements;
};

// Ejecutar diagnóstico
diagnosticScript();

