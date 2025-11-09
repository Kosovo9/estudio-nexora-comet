/**
 * SCRIPT DE EMERGENCIA - Remoción de Recuadro Blanco
 * Ejecutar en consola del navegador si el problema persiste
 */

(function removeWhiteFrameEmergency() {
    console.log('🚨 INICIANDO REMOCIÓN DE RECUADRO BLANCO...');
    
    // 1. Aplicar estilos de emergencia a todos los elementos
    const emergencyStyles = `
        <style id="white-frame-fix-emergency">
            * {
                background: transparent !important;
                background-color: transparent !important;
            }
            body, html, #__next, #root, #app, main, .main, .app {
                background: transparent !important;
                background-color: transparent !important;
            }
            [class*="white"], [class*="White"], [class*="background"], [class*="Background"] {
                background: transparent !important;
            }
        </style>
    `;
    
    // 2. Inyectar estilos
    if (!document.getElementById('white-frame-fix-emergency')) {
        document.head.insertAdjacentHTML('beforeend', emergencyStyles);
    }
    
    // 3. Forzar transparencia en elementos específicos
    const suspects = [
        'body', 'html', '#__next', '#root', '#app', 'main', 
        '.main-container', '.app-container', '.page-container',
        '.layout-container', '.background', '.overlay'
    ];
    
    suspects.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            if (el instanceof HTMLElement) {
                el.style.backgroundColor = 'transparent';
                el.style.background = 'transparent';
            }
        });
    });
    
    console.log('✅ RECUADRO BLANCO REMOVIDO - Verificar resultado');
})();

/**
 * Script de verificación
 */
function verifyWhiteFrameRemoval() {
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    const htmlBg = window.getComputedStyle(document.documentElement).backgroundColor;
    
    console.log('🔍 VERIFICACIÓN:');
    console.log('Body background:', bodyBg);
    console.log('HTML background:', htmlBg);
    
    const transparentColors = ['transparent', 'rgba(0, 0, 0, 0)'];
    if (transparentColors.includes(bodyBg) && transparentColors.includes(htmlBg)) {
        console.log('✅ ÉXITO: Recuadro blanco eliminado');
    } else {
        console.log('❌ FALLO: Aún hay fondo blanco');
    }
}

// Ejecutar verificación
verifyWhiteFrameRemoval();

