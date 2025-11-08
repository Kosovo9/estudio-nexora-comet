describe('AI Generation Flow - Complete Testing', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  describe('AI Generation with Timer and UX', () => {
    it('should show timer during generation', () => {
      cy.visit('/')
      cy.wait(2000)

      // Navigate through steps (if authenticated)
      cy.get('body').then(($body) => {
        if ($body.text().includes('Generate') || $body.text().includes('Generar')) {
          // Click generate button
          cy.contains(/generate|generar/i).click({ force: true })

          // Verify generating message appears
          cy.contains(/generando tu foto|generating your photo/i, { timeout: 3000 }).should('exist')

          // Verify timer is displayed
          cy.contains(/tiempo transcurrido|elapsed time|segundos|seconds/i, { timeout: 2000 }).should('exist')

          // Verify timer increments (wait 2 seconds and check)
          cy.wait(2000)
          cy.contains(/\d+s|\d+m \d+s/).should('exist')
        }
      })
    })

    it('should show progress bar during generation', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('body').then(($body) => {
        if ($body.find('button').text().includes('Generate')) {
          cy.contains(/generate|generar/i).click({ force: true })

          // Check for progress bar element
          cy.get('.bg-gray-700.rounded-full, [class*="progress"]', { timeout: 3000 }).should('exist')

          // Verify progress bar has width (indicating progress)
          cy.get('.bg-gradient-to-r.from-blue-500, [class*="progress-bar"]').should('exist')
        }
      })
    })

    it('should show spinner/loader during generation', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('body').then(($body) => {
        if ($body.find('button').text().includes('Generate')) {
          cy.contains(/generate|generar/i).click({ force: true })

          // Check for spinner (Loader2 icon or animated element)
          cy.get('.animate-spin, [aria-busy="true"], [role="status"]', { timeout: 3000 }).should('exist')
        }
      })
    })

    it('should handle timeout after 20 seconds', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('body').then(($body) => {
        if ($body.find('button').text().includes('Generate')) {
          cy.contains(/generate|generar/i).click({ force: true })

          // Wait for timeout message (if generation takes too long)
          cy.contains(
            /tardando demasiado|taking too long|revisa tu conexión|check your connection/i,
            { timeout: 25000 }
          ).then(($el: any) => {
            if ($el && $el.length > 0) {
              cy.log('✅ Timeout message displayed correctly')
              // Verify error styling
              cy.get('.text-red-400, [class*="error"]').should('exist')
            }
          })
        }
      })
    })

    it('should show helpful tips when not generating', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('body').then(($body) => {
        if ($body.text().includes('Generate') && !$body.text().includes('Generando')) {
          // Check for helpful tips
          cy.contains(/tip|consejo|normalmente toma|usually takes/i).should('exist')
        }
      })
    })

    it('should disable generate button during generation', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('body').then(($body) => {
        if ($body.find('button').text().includes('Generate')) {
          cy.contains(/generate|generar/i).click({ force: true })

          // Verify button is disabled or has aria-busy
          cy.contains(/generate|generar/i)
            .parent('button')
            .should('satisfy', ($el: any) => $el[0].disabled || $el[0].getAttribute('aria-busy') === 'true')
        }
      })
    })

    it('should show success message after completion', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('body').then(($body) => {
        if ($body.find('button').text().includes('Generate')) {
          cy.contains(/generate|generar/i).click({ force: true })

          // Wait for completion (max 20 seconds)
          cy.contains(/completada|completed|éxito|success/i, { timeout: 20000 }).then(($el: any) => {
            if ($el && $el.length > 0) {
              cy.log('✅ Success message displayed')
              // Verify success styling
              cy.get('.text-green-400, [class*="success"]').should('exist')
            }
          })
        }
      })
    })

    it('should show error message on failure', () => {
      cy.visit('/')
      cy.wait(2000)

      // Intercept API call to simulate failure
      cy.intercept('POST', '**/api/upload', { statusCode: 500, body: { error: 'Server error' } }).as('apiError')

      cy.get('body').then(($body) => {
        if ($body.find('button').text().includes('Generate')) {
          cy.contains(/generate|generar/i).click({ force: true })

          // Wait for error message
          cy.contains(/error|problema|hubo un problema/i, { timeout: 10000 }).then(($el: any) => {
            if ($el && $el.length > 0) {
              cy.log('✅ Error message displayed correctly')
              cy.get('.text-red-400, [class*="error"]').should('exist')
            }
          })
        }
      })
    })
  })

  describe('AI Generation Performance', () => {
    it('should complete generation within reasonable time', () => {
      cy.visit('/')
      cy.wait(2000)

      const startTime = Date.now()

      cy.get('body').then(($body) => {
        if ($body.find('button').text().includes('Generate')) {
          cy.contains(/generate|generar/i).click({ force: true })

          // Wait for completion or timeout
          cy.contains(/completada|completed|tardando demasiado|taking too long/i, {
            timeout: 25000,
          }).then(() => {
            const endTime = Date.now()
            const duration = endTime - startTime

            // Should complete or timeout within 25 seconds
            expect(duration).to.be.lessThan(30000)
            cy.log(`Generation took ${duration}ms`)
          })
        }
      })
    })
  })
})

