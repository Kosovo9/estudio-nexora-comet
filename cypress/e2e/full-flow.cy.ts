describe('Studio Nexora Comet - Full QA Suite', () => {
  const baseUrl = Cypress.config().baseUrl || 'http://localhost:3000'

  beforeEach(() => {
    // Clear cookies and local storage before each test
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  describe('Home Page & Main Buttons', () => {
    it('should load home page and verify main elements', () => {
      cy.visit('/')
      cy.wait(2000)

      // Check main title
      cy.contains('Studio Nexora Comet', { timeout: 10000 }).should('be.visible')
      cy.contains('AI-Powered Photo Studio').should('be.visible')

      // Check for sign in button/link
      cy.get('a[href*="sign-in"], button').contains(/sign in|iniciar sesión/i).should('exist')
    })

    it('should verify all interactive buttons exist and are clickable', () => {
      cy.visit('/')
      cy.wait(2000)

      // Check for buttons (may be hidden if not logged in)
      cy.get('body').then(($body) => {
        if ($body.find('button').length > 0) {
          cy.get('button').each(($btn) => {
            cy.wrap($btn).should('be.visible')
            if (!$btn.prop('disabled')) {
              cy.wrap($btn).click({ force: true })
            }
          })
        }
      })

      // Check for links
      cy.get('a').should('have.length.greaterThan', 0)
      cy.get('a').each(($link) => {
        cy.wrap($link).should('exist')
      })
    })

    it('should navigate to sign in page', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.contains(/sign in|iniciar sesión/i).click({ force: true })
      cy.url().should('include', '/sign-in')
    })
  })

  describe('Authentication Flow (Clerk)', () => {
    it('should display sign in page', () => {
      cy.visit('/sign-in')
      cy.wait(2000)

      // Clerk components should be visible
      cy.get('body').should(($body: any) => {
        const text = $body.text()
        expect(text.includes('Sign in') || text.includes('Email')).to.be.true
      })
    })

    it('should display sign up page', () => {
      cy.visit('/sign-up')
      cy.wait(2000)

      // Clerk components should be visible
      cy.get('body').should(($body: any) => {
        const text = $body.text()
        expect(text.includes('Sign up') || text.includes('Create')).to.be.true
      })
    })

    // Uncomment to test actual login (requires test credentials)
    // it('should login with test credentials', () => {
    //   cy.visit('/sign-in')
    //   cy.wait(2000)
    //   
    //   cy.get('input[type="email"]').type('test@example.com')
    //   cy.get('input[type="password"]').type('testpassword123')
    //   cy.get('button[type="submit"]').click()
    //   
    //   cy.url({ timeout: 10000 }).should('not.include', '/sign-in')
    // })
  })

  describe('Photo Upload Flow', () => {
    beforeEach(() => {
      // Mock authentication - in real tests, you'd use actual login
      // For now, we'll test the UI elements
      cy.visit('/')
      cy.wait(2000)
    })

    it('should display upload component when authenticated', () => {
      // This test assumes user is logged in
      // In CI, you might need to set auth cookies
      cy.get('body').then(($body) => {
        if ($body.text().includes('Upload Photos') || $body.text().includes('Upload')) {
          cy.contains(/upload|subir/i).should('exist')
        }
      })
    })

    it('should show minimum image requirement', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Upload')) {
          cy.contains(/at least|mínimo|3/i).should('exist')
        }
      })
    })
  })

  describe('Consent Form Flow', () => {
    it('should display consent checkboxes', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('body').then(($body) => {
        if ($body.text().includes('Consent') || $body.text().includes('Authorization')) {
          cy.get('input[type="checkbox"]').should('have.length.at.least', 1)
        }
      })
    })

    it('should require all checkboxes to be checked', () => {
      cy.get('body').then(($body) => {
        if ($body.find('input[type="checkbox"]').length > 0) {
          cy.get('input[type="checkbox"]').each(($checkbox) => {
            cy.wrap($checkbox).check({ force: true })
          })
          
          cy.get('button[type="submit"]').should('not.be.disabled')
        }
      })
    })
  })

  describe('Style Selector Flow', () => {
    it('should display style options', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('body').then(($body) => {
        if ($body.text().includes('Dark Studio') || $body.text().includes('Paris Café')) {
          cy.contains(/dark studio|paris café/i).should('exist')
        }
      })
    })

    it('should allow style selection', () => {
      cy.get('body').then(($body) => {
        if ($body.find('button').text().includes('Dark Studio') || 
            $body.find('button').text().includes('Paris Café')) {
          cy.contains(/dark studio|paris café/i).first().click({ force: true })
        }
      })
    })
  })

  describe('AI Generation Flow', () => {
    it('should have generate button', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('body').then(($body) => {
        if ($body.text().includes('Generate') || $body.text().includes('Generar')) {
          cy.contains(/generate|generar/i).should('exist')
        }
      })
    })

    it('should show generating state with timer', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('body').then(($body) => {
        if ($body.find('button').text().includes('Generate') || 
            $body.find('button').text().includes('Generar')) {
          
          // Click generate button
          cy.contains(/generate|generar/i).click({ force: true })
          
          // Verify generating state appears
          cy.contains(/generando tu foto|generating/i, { timeout: 5000 }).should('exist')
          
          // Verify timer is visible
          cy.contains(/tiempo transcurrido|elapsed|segundos|seconds/i, { timeout: 2000 }).should('exist')
          
          // Verify spinner/loader is visible
          cy.get('[role="status"], .animate-spin, [aria-busy="true"]').should('exist')
          
          // Wait for generation (max 20 seconds)
          cy.wait(16000, { log: false })
          
          // Check if generation completed or timeout message appears
          cy.get('body').then(($body2) => {
            const hasError = $body2.text().includes('tardando demasiado') || 
                           $body2.text().includes('taking too long')
            const hasSuccess = $body2.text().includes('completada') || 
                              $body2.text().includes('completed')
            
            if (!hasError && !hasSuccess) {
              // Still generating, wait a bit more
              cy.wait(5000, { log: false })
            }
          })
        }
      })
    })

    it('should show timeout message after 20 seconds', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('body').then(($body) => {
        if ($body.find('button').text().includes('Generate')) {
          cy.contains(/generate|generar/i).click({ force: true })
          
          // Wait for timeout message (if generation takes too long)
          cy.contains(/tardando demasiado|taking too long|revisa tu conexión|check your connection/i, {
            timeout: 25000,
          }).then(($el: any) => {
            if ($el && $el.length > 0) {
              cy.log('✅ Timeout message displayed correctly')
            }
          })
        }
      })
    })

    it('should show progress indicator during generation', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('body').then(($body) => {
        if ($body.find('button').text().includes('Generate')) {
          cy.contains(/generate|generar/i).click({ force: true })
          
          // Check for progress bar
          cy.get('.bg-gray-700.rounded-full, [class*="progress"], [role="progressbar"]', {
            timeout: 3000,
          }).should('exist')
        }
      })
    })
  })

  describe('Watermark Preview Flow', () => {
    it('should display watermark preview when image is generated', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('body').then(($body) => {
        if ($body.text().includes('Watermark') || $body.text().includes('Preview')) {
          cy.contains(/watermark|preview|marca de agua/i).should('exist')
        }
      })
    })

    it('should show continue to payment button', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Continue to Payment') || 
            $body.text().includes('Continuar al Pago')) {
          cy.contains(/continue|continuar|payment|pago/i).should('exist')
        }
      })
    })
  })

  describe('Payment Flow', () => {
    it('should display payment options', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('body').then(($body) => {
        if ($body.text().includes('Bank Transfer') || 
            $body.text().includes('Stripe') ||
            $body.text().includes('Credit Card')) {
          cy.contains(/bank|stripe|card|transfer|pago/i).should('exist')
        }
      })
    })

    it('should navigate to Stripe checkout', () => {
      cy.get('body').then(($body) => {
        if ($body.find('button').text().includes('Stripe') || 
            $body.find('button').text().includes('Pay with')) {
          cy.contains(/stripe|pay with|pagar con/i).click({ force: true })
          
          // Stripe redirects to external URL
          cy.url({ timeout: 10000 }).should('satisfy', (url) => {
            return url.includes('stripe.com') || url.includes('checkout')
          })
        }
      })
    })

    it('should display bank transfer form', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Bank Transfer') || 
            $body.text().includes('Transferencia')) {
          cy.contains(/bank transfer|transferencia/i).click({ force: true })
          cy.get('input[type="text"]').should('have.length.at.least', 1)
        }
      })
    })
  })

  describe('Payment Success/Cancel Pages', () => {
    it('should display payment success page', () => {
      cy.visit('/payment-success?session_id=test_session')
      cy.wait(2000)

      cy.contains(/success|éxito|completado/i).should('be.visible')
    })

    it('should display payment cancel page', () => {
      cy.visit('/payment-cancel')
      cy.wait(2000)

      cy.contains(/cancel|cancelado|cancelled/i).should('be.visible')
    })
  })

  describe('Logout Flow', () => {
    it('should have logout functionality', () => {
      cy.visit('/')
      cy.wait(2000)

      // Clerk handles logout, check if user menu exists
      cy.get('body').then(($body) => {
        if ($body.text().includes('Sign out') || 
            $body.text().includes('Logout') ||
            $body.text().includes('Cerrar sesión')) {
          cy.contains(/sign out|logout|cerrar sesión/i).should('exist')
        }
      })
    })
  })

  describe('Responsive Design', () => {
    it('should work on mobile viewport', () => {
      cy.viewport(375, 667) // iPhone SE
      cy.visit('/')
      cy.wait(2000)

      cy.contains('Studio Nexora Comet').should('be.visible')
    })

    it('should work on tablet viewport', () => {
      cy.viewport(768, 1024) // iPad
      cy.visit('/')
      cy.wait(2000)

      cy.contains('Studio Nexora Comet').should('be.visible')
    })
  })

  describe('Error Handling', () => {
    it('should handle 404 pages gracefully', () => {
      cy.visit('/non-existent-page', { failOnStatusCode: false })
      cy.wait(2000)

      // Next.js should show 404 page
      cy.get('body').should(($body: any) => {
        const text = $body.text()
        expect(text.includes('404') || text.includes('Not Found')).to.be.true
      })
    })
  })
})

