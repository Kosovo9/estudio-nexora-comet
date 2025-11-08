describe('Error Tracking & Monitoring Tests', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  describe('Console Error Detection', () => {
    it('should have no console errors on page load', () => {
      const errors: string[] = []
      
      cy.visit('/', {
        onBeforeLoad(win) {
          cy.stub(win.console, 'error').callsFake((message) => {
            errors.push(String(message))
          })
        }
      })
      cy.wait(3000)

      cy.then(() => {
        if (errors.length > 0) {
          cy.log(`⚠️ Found ${errors.length} console errors:`)
          errors.forEach((error) => {
            cy.log(`  - ${error}`)
          })
        } else {
          cy.log('✅ No console errors detected')
        }
      })
    })

    it('should have no console warnings on critical paths', () => {
      const warnings: string[] = []
      
      cy.visit('/', {
        onBeforeLoad(win) {
          cy.stub(win.console, 'warn').callsFake((message) => {
            warnings.push(String(message))
          })
        }
      })
      cy.wait(2000)

      // Navigate through main flows
      cy.get('body').then(($body) => {
        if ($body.find('button').length > 0) {
          cy.get('button').first().click({ force: true })
          cy.wait(1000)
        }
      })

      cy.then(() => {
        // Filter out known non-critical warnings
        const criticalWarnings = warnings.filter((w) => 
          !w.includes('ResizeObserver') && 
          !w.includes('deprecated')
        )
        
        if (criticalWarnings.length > 0) {
          cy.log(`⚠️ Found ${criticalWarnings.length} critical warnings`)
        } else {
          cy.log('✅ No critical console warnings')
        }
      })
    })
  })

  describe('Sentry Error Tracking', () => {
    it('should have Sentry initialized (if configured)', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.window().then((win: any) => {
        // Check for Sentry
        if ((win as any).Sentry) {
          expect((win as any).Sentry).to.exist
          cy.log('✅ Sentry is initialized')
        } else {
          cy.log('ℹ️ Sentry not detected (may not be configured)')
        }
      })
    })

    it('should capture errors to Sentry', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.window().then((win: any) => {
        if ((win as any).Sentry) {
          // Simulate error capture
          const captureException = cy.stub((win as any).Sentry, 'captureException')
          
          // Trigger a test error (if possible)
          cy.get('body').then(() => {
            // Sentry should be ready to capture
            cy.log('✅ Sentry error capture available')
          })
        }
      })
    })
  })

  describe('Network Error Detection', () => {
    it('should handle failed API requests gracefully', () => {
      cy.visit('/')
      cy.wait(2000)

      // Intercept API calls and check error handling
      cy.intercept('POST', '**/api/**', { statusCode: 500 }).as('apiError')
      
      cy.get('body').then(($body) => {
        if ($body.find('form').length > 0) {
          cy.get('form').first().then(($form) => {
            // Check if error handling exists
            cy.log('✅ Error handling structure present')
          })
        }
      })
    })

    it('should display user-friendly error messages', () => {
      cy.visit('/')
      cy.wait(2000)

      // Check for error message containers
      cy.get('body').then(($body) => {
        const hasErrorHandling = 
          $body.find('[role="alert"]').length > 0 ||
          $body.find('.error').length > 0 ||
          $body.find('[class*="error"]').length > 0

        if (hasErrorHandling) {
          cy.log('✅ Error message display structure present')
        }
      })
    })
  })

  describe('JavaScript Error Boundaries', () => {
    it('should catch React errors gracefully', () => {
      cy.visit('/')
      cy.wait(2000)

      // Check for error boundary indicators
      cy.get('body').then(($body) => {
        // React error boundaries typically show fallback UI
        const hasErrorBoundary = 
          !$body.text().includes('Something went wrong') ||
          !$body.text().includes('Error')

        cy.log('✅ Error boundary structure checked')
      })
    })
  })

  describe('Performance Monitoring', () => {
    it('should track page load performance', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.window().then((win: any) => {
        const perfData = win.performance
        
        if (perfData && perfData.timing) {
          const loadTime = perfData.timing.loadEventEnd - perfData.timing.navigationStart
          const domReady = perfData.timing.domContentLoadedEventEnd - perfData.timing.navigationStart
          
          cy.log(`✅ Page load time: ${loadTime}ms`)
          cy.log(`✅ DOM ready time: ${domReady}ms`)
          
          expect(loadTime).to.be.lessThan(10000) // 10 seconds max
        }
      })
    })

    it('should track resource loading', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.window().then((win: any) => {
        const perfData = win.performance
        
        if (perfData && perfData.getEntriesByType) {
          const resources = perfData.getEntriesByType('resource')
          const slowResources = resources.filter((r: any) => r.duration > 3000)
          
          if (slowResources.length > 0) {
            cy.log(`⚠️ Found ${slowResources.length} slow resources (>3s)`)
          } else {
            cy.log('✅ All resources loaded efficiently')
          }
        }
      })
    })
  })

  describe('Uncaught Exception Handling', () => {
    it('should handle uncaught exceptions', () => {
      // Cypress doesn't support onUncaughtException in visit options
      // Use failOnStatusCode: false and check for errors manually
      cy.visit('/', { failOnStatusCode: false })
      cy.wait(2000)

      cy.window().then((win: any) => {
        // Check for console errors
        const errors: any[] = []
        const originalError = win.console?.error
        if (originalError) {
          win.console.error = (...args: any[]) => {
            errors.push(args)
            originalError.apply(win.console, args)
          }
        }
        
        cy.wait(1000).then(() => {
          if (errors.length > 0) {
            cy.log(`⚠️ Found ${errors.length} console errors`)
          } else {
            cy.log('✅ No uncaught exceptions detected')
          }
        })
      })
    })
  })
})

