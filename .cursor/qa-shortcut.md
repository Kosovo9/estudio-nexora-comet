# QA Automático - Shortcut

## Comandos Rápidos

```bash
# Tests E2E completos
npm run test:e2e:full

# Generar reporte HTML
npm run test:report

# Abrir reporte (auto-detecta OS)
# Mac: open ./cypress/reports/html/mochawesome.html
# Linux: xdg-open ./cypress/reports/html/mochawesome.html
# Windows: start ./cypress/reports/html/mochawesome.html
```

## Scripts Disponibles

- `npm run test:e2e:full` - Todos los tests E2E
- `npm run test:report` - Generar reporte HTML
- `npm run test:mobile` - Tests responsive
- `npm run test:analytics` - Tests analytics
- `npm run test:seo` - Tests SEO
- `npm run qa:run` - QA completo con reporte

## Shortcuts de Escritorio

- `./run-qa.sh` (Linux/macOS)
- `run-qa.bat` (Windows)

## API Endpoints

- `POST /api/admin/run-qa` - Ejecutar QA desde navegador
- `GET /api/admin/export?format=csv` - Exportar CSV
- `GET /api/admin/export?format=pdf` - Exportar PDF
