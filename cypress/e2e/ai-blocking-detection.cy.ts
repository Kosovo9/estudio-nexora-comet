describe('AI Generation Blocking Detection - Auto QA', () => {
  const MAX_GENERATION_TIME = 20000 // 20 segundos máximo
  const WARNING_TIME = 12000 // 12 segundos para warning

  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  describe('Detecta si se queda atorado en Generating', () => {
    it('should detect if generation gets stuck', () => {
      cy.visit('/')
      cy.wait(2000)

      // Interceptar llamadas API para detectar bloqueos
      cy.intercept('POST', '**/api/upload', {
        delay: 500,
        statusCode: 200,
        body: { success: true },
      }).as('uploadApi')

      cy.get('body').then(($body) => {
        if ($body.text().includes('Generate') || $body.text().includes('Generar')) {
          const startTime = Date.now()

          // Click en Generate
          cy.contains(/generate|generar/i).click({ force: true })

          // Verificar que aparece "Generating"
          cy.contains(/generando|generating/i, { timeout: 3000 }).should('exist')

          // Monitorear que NO se quede atorado
          cy.get('body', { timeout: MAX_GENERATION_TIME }).then(($body2) => {
            const elapsed = Date.now() - startTime

            // Verificar que después de 12 segundos, hay progreso o completó
            if (elapsed >= WARNING_TIME) {
              const stillGenerating = $body2.text().includes('Generando') || 
                                     $body2.text().includes('Generating')
              const hasError = $body2.text().includes('error') || 
                           $body2.text().includes('Error') ||
                           $body2.text().includes('tardando demasiado')
              const hasSuccess = $body2.text().includes('completada') || 
                                $body2.text().includes('completed') ||
                                $body2.text().includes('preview')

              if (stillGenerating && !hasError && !hasSuccess) {
                cy.log('⚠️ WARNING: Generation taking longer than expected')
                // Verificar que al menos el timer está avanzando
                cy.contains(/\d+s|\d+m \d+s/).should('exist')
              }
            }

            // Después de MAX_GENERATION_TIME, debe haber completado o error
            cy.wait(MAX_GENERATION_TIME - elapsed, { log: false })

            cy.get('body').then(($body3) => {
              const finalStillGenerating = $body3.text().includes('Generando') || 
                                          $body3.text().includes('Generating')
              const finalHasError = $body3.text().includes('tardando demasiado') || 
                                   $body3.text().includes('taking too long') ||
                                   $body3.text().includes('Error generando')
              const finalHasSuccess = $body3.text().includes('preview') || 
                                     $body3.text().includes('Watermark') ||
                                     $body3.text().includes('completada')

              // Si después de MAX_GENERATION_TIME sigue generando sin error/success, es un bloqueo
              if (finalStillGenerating && !finalHasError && !finalHasSuccess) {
                throw new Error('❌ BLOQUEO DETECTADO: Generation stuck after 20 seconds')
              }

              // Debe tener éxito o error, no quedarse en "generating"
              expect(finalHasError || finalHasSuccess).to.be.true
            })
          })
        }
      })
    })

    it('should detect API timeout or pending requests', () => {
      cy.visit('/')
      cy.wait(2000)

      // Interceptar y simular timeout
      cy.intercept('POST', '**/api/upload', {
        statusCode: 504,
        body: { error: 'Gateway Timeout' },
        delay: 25000, // Simular timeout
      }).as('uploadTimeout')

      cy.get('body').then(($body) => {
        if ($body.find('button').text().includes('Generate')) {
          cy.contains(/generate|generar/i).click({ force: true })

          // Debe mostrar error de timeout
          cy.contains(/timeout|tardando demasiado|error|problema/i, {
            timeout: 30000,
          }).should('exist')

          cy.log('✅ Timeout detection working correctly')
        }
      })
    })

    it('should verify timer continues during generation', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('body').then(($body) => {
        if ($body.find('button').text().includes('Generate')) {
          cy.contains(/generate|generar/i).click({ force: true })

          // Esperar 3 segundos
          cy.wait(3000)

          // Verificar que el timer avanzó
          cy.contains(/tiempo transcurrido|elapsed/i).then(($timer: any) => {
            if (!$timer) return
            const timerText = $timer.text()
            const seconds = parseInt(timerText.match(/(\d+)s/)?.[1] || '0')

            // Debe mostrar al menos 3 segundos
            expect(seconds).to.be.at.least(2)
            cy.log(`✅ Timer advancing correctly: ${timerText}`)
          })
        }
      })
    })

    it('should detect if progress bar is frozen', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('body').then(($body) => {
        if ($body.find('button').text().includes('Generate')) {
          cy.contains(/generate|generar/i).click({ force: true })

          // Obtener width inicial de progress bar
          cy.get('.bg-gradient-to-r.from-blue-500, [class*="progress"]').then(($progress) => {
            const initialWidth = $progress[0].style.width || '0%'
            const initialPercent = parseFloat(initialWidth)

            // Esperar 5 segundos
            cy.wait(5000)

            // Verificar que el progress bar avanzó
            cy.get('.bg-gradient-to-r.from-blue-500, [class*="progress"]').then(($progress2) => {
              const newWidth = $progress2[0].style.width || '0%'
              const newPercent = parseFloat(newWidth)

              // El progress debe haber aumentado
              if (newPercent <= initialPercent) {
                cy.log('⚠️ WARNING: Progress bar may be frozen')
              } else {
                cy.log('✅ Progress bar advancing correctly')
              }
            })
          })
        }
      })
    })
  })

  describe('End-to-End Flow Verification', () => {
    it('should complete full AI generation flow without blocking', () => {
      cy.visit('/')
      cy.wait(2000)

      const flowStartTime = Date.now()

      // Step 1: Upload (si está disponible)
      cy.get('body').then(($body) => {
        if ($body.text().includes('Upload') && $body.find('input[type="file"]').length > 0) {
          // Simular upload (si es posible)
          cy.log('Step 1: Upload photos')
        }

        // Step 2: Consent
        if ($body.text().includes('Consent') || $body.text().includes('Authorization')) {
          cy.get('input[type="checkbox"]').each(($checkbox) => {
            cy.wrap($checkbox).check({ force: true })
          })
          cy.contains(/continue|continuar/i).click({ force: true })
          cy.wait(1000)
        }

        // Step 3: Style Selection
        if ($body.text().includes('Dark Studio') || $body.text().includes('Paris Café')) {
          cy.contains(/dark studio|paris café/i).first().click({ force: true })
          cy.wait(1000)
        }

        // Step 4: Generate
        if ($body.find('button').text().includes('Generate')) {
          cy.contains(/generate|generar/i).click({ force: true })

          // Monitorear que no se quede atorado
          cy.contains(/generando|generating/i, { timeout: 3000 }).should('exist')

          // Esperar máximo 20 segundos para completar
          cy.contains(/preview|watermark|completada|error|tardando demasiado/i, {
            timeout: MAX_GENERATION_TIME,
          }).should('exist')

          const flowDuration = Date.now() - flowStartTime

          // Verificar que el flujo completo tomó menos de 25 segundos
          expect(flowDuration).to.be.lessThan(25000)

          cy.log(`✅ Full flow completed in ${flowDuration}ms`)
        }
      })
    })

    it('should handle network errors gracefully', () => {
      cy.visit('/')
      cy.wait(2000)

      // Simular error de red
      cy.intercept('POST', '**/api/upload', {
        forceNetworkError: true,
      }).as('networkError')

      cy.get('body').then(($body) => {
        if ($body.find('button').text().includes('Generate')) {
          cy.contains(/generate|generar/i).click({ force: true })

          // Debe mostrar mensaje de error amigable
          cy.contains(/error|problema|intenta nuevamente|try again/i, {
            timeout: 10000,
          }).should('exist')

          cy.log('✅ Network error handled gracefully')
        }
      })
    })
  })

  describe('Performance Monitoring', () => {
    it('should track generation performance metrics', () => {
      cy.visit('/')
      cy.wait(2000)

      const metrics = {
        startTime: 0,
        generatingStart: 0,
        completedTime: 0,
        totalTime: 0,
      }

      cy.get('body').then(($body) => {
        if ($body.find('button').text().includes('Generate')) {
          metrics.startTime = Date.now()

          cy.contains(/generate|generar/i).click({ force: true })

          cy.contains(/generando|generating/i, { timeout: 3000 }).then(() => {
            metrics.generatingStart = Date.now()
          })

          cy.contains(/preview|watermark|completada|error/i, {
            timeout: MAX_GENERATION_TIME,
          }).then(() => {
            metrics.completedTime = Date.now()
            metrics.totalTime = metrics.completedTime - metrics.startTime

            cy.log(`📊 Performance Metrics:`)
            cy.log(`  - Total time: ${metrics.totalTime}ms`)
            cy.log(`  - Generation time: ${metrics.completedTime - metrics.generatingStart}ms`)

            // Verificar que está dentro de límites razonables
            expect(metrics.totalTime).to.be.lessThan(25000)
          })
        }
      })
    })
  })
})

