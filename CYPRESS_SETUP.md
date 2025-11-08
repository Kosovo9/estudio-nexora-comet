# Cypress Testing Setup - Studio Nexora Comet

## 📋 Instalación Completa

### 1. Dependencias Instaladas

```bash
npm install cypress cypress-mochawesome-reporter --save-dev
```

✅ **Completado** - Dependencias instaladas

### 2. Estructura de Archivos

```
cypress/
├── e2e/
│   ├── full-flow.cy.ts          # Tests completos del flujo
│   └── api-tests.cy.ts          # Tests de API endpoints
├── fixtures/
│   └── example.json             # Datos de prueba
├── support/
│   ├── commands.ts                # Comandos personalizados
│   └── e2e.ts                 # Configuración global
cypress.config.ts              # Configuración de Cypress
```

### 3. Scripts Disponibles

```bash
# Abrir Cypress en modo interactivo
npm run cypress:open

# Ejecutar tests en modo headless
npm run cypress:run

# Ejecutar tests con reportes
npm run test:e2e

# Ejecutar en CI (build + start + tests)
npm run test:ci
```

## 🧪 Tests Implementados

### ✅ Home Page & Main Buttons
- Verifica carga de página principal
- Valida existencia de botones principales
- Navegación a sign-in

### ✅ Authentication Flow (Clerk)
- Página de sign-in
- Página de sign-up
- (Opcional) Login con credenciales de prueba

### ✅ Photo Upload Flow
- Componente de upload
- Requisito mínimo de 3 imágenes

### ✅ Consent Form Flow
- Checkboxes de consentimiento
- Validación de todos los checkboxes

### ✅ Style Selector Flow
- Opciones de estilo (Dark Studio / Paris Café)
- Selección de estilo

### ✅ AI Generation Flow
- Botón de generación
- Estado de generación

### ✅ Watermark Preview Flow
- Preview con watermark
- Botón de continuar a pago

### ✅ Payment Flow
- Opciones de pago (Bank / Stripe)
- Navegación a Stripe checkout
- Formulario de transferencia bancaria

### ✅ Payment Success/Cancel Pages
- Página de éxito
- Página de cancelación

### ✅ Logout Flow
- Funcionalidad de logout

### ✅ Responsive Design
- Tests en móvil (375x667)
- Tests en tablet (768x1024)

### ✅ Error Handling
- Manejo de páginas 404

### ✅ API Tests
- Autenticación requerida en endpoints
- Validación de webhooks

## 🚀 GitHub Actions Workflow

### Configuración Automática

El workflow `.github/workflows/cypress.yml` está configurado para:

1. ✅ Ejecutarse en push a `main` y `develop`
2. ✅ Ejecutarse en pull requests
3. ✅ Build de la aplicación Next.js
4. ✅ Ejecutar tests en modo headless
5. ✅ Generar reportes HTML
6. ✅ Subir reportes como artefactos
7. ✅ Enviar notificaciones a Slack/Discord

### Secrets Necesarios en GitHub

Configura estos secrets en tu repositorio (Settings → Secrets):

```
CYPRESS_BASE_URL          # URL de producción (opcional)
SLACK_WEBHOOK_URL         # Webhook de Slack (opcional)
DISCORD_WEBHOOK_URL       # Webhook de Discord (opcional)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## 📊 Reportes

### Reportes HTML

Los reportes se generan automáticamente en:
```
cypress/reports/html/
```

### Acceso a Reportes en CI

1. Ve a la pestaña "Actions" en GitHub
2. Selecciona el workflow run
3. Descarga el artefacto "QA-Report-{number}"
4. Abre `cypress/reports/html/merged-report.html`

## 🔔 Notificaciones

### Slack

1. Crea un webhook en Slack:
   - https://api.slack.com/apps
   - Create New App → Incoming Webhooks
   - Copia la URL del webhook

2. Agrega como secret: `SLACK_WEBHOOK_URL`

### Discord

1. Crea un webhook en Discord:
   - Configuración del servidor → Integraciones → Webhooks
   - Copia la URL del webhook

2. Agrega como secret: `DISCORD_WEBHOOK_URL`

## 🎯 Personalización

### Agregar Tests Específicos

Edita `cypress/e2e/full-flow.cy.ts` para agregar tests personalizados:

```typescript
it('Mi test personalizado', () => {
  cy.visit('/')
  // Tu código aquí
})
```

### Modificar Selectors

Los tests usan selectors flexibles. Si cambias componentes, actualiza:

```typescript
cy.contains('Texto del botón').click()
cy.get('.mi-clase-css').should('exist')
```

### Tests de Login Real

Para tests con login real, descomenta y configura:

```typescript
it('should login with test credentials', () => {
  cy.visit('/sign-in')
  cy.get('input[type="email"]').type('test@example.com')
  cy.get('input[type="password"]').type('password123')
  cy.get('button[type="submit"]').click()
})
```

## 📝 Próximos Pasos

1. ✅ Tests básicos implementados
2. ⏭️ Configurar webhooks de Slack/Discord (opcional)
3. ⏭️ Agregar tests de login real (si es necesario)
4. ⏭️ Personalizar selectors según cambios en UI
5. ⏭️ Agregar tests de integración con APIs reales

## 🐛 Troubleshooting

### Tests fallan en CI pero pasan localmente

- Verifica que el servidor Next.js esté corriendo
- Revisa los timeouts en `cypress.config.ts`
- Aumenta `wait-on-timeout` en el workflow

### Reportes no se generan

- Verifica que `cypress-mochawesome-reporter` esté instalado
- Revisa permisos de escritura en `cypress/reports`

### Notificaciones no funcionan

- Verifica que los secrets estén configurados
- Prueba el webhook manualmente con curl
- Revisa los logs del workflow

## ✅ Checklist de Verificación

- [x] Cypress instalado
- [x] Tests básicos creados
- [x] GitHub Actions workflow configurado
- [x] Scripts de npm agregados
- [ ] Webhooks de Slack/Discord configurados (opcional)
- [ ] Tests de login real configurados (opcional)
- [ ] Reportes verificados

---

**Estado:** ✅ Setup completo - Listo para usar

Ejecuta `npm run cypress:open` para comenzar a testear!

