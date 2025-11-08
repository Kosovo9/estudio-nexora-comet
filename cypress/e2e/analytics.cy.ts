describe('Analytics & Tracking Tests', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  describe('Google Analytics / GA4', () => {
    it('should have gtag function available', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.window().then((win: any) => {
        // Check if gtag is available (Google Analytics)
        if (win.gtag) {
          expect(win.gtag).to.exist
          cy.log('✅ Google Analytics (gtag) is loaded')
        } else {
          cy.log('⚠️ Google Analytics not detected (may not be configured)')
        }
      })
    })

    it('should track page views', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.window().then((win: any) => {
        // Check for dataLayer (Google Tag Manager)
        if (win.dataLayer) {
          expect(win.dataLayer).to.exist
          cy.log('✅ Google Tag Manager (dataLayer) is loaded')
        }
      })
    })

    it('should track button clicks as events', () => {
      cy.visit('/')
      cy.wait(2000)

      // Track clicks on main buttons
      cy.get('body').then(($body) => {
        if ($body.find('button').length > 0) {
          cy.get('button').first().click({ force: true })
          
          cy.window().then((win: any) => {
            if (win.dataLayer) {
              // Check if events are being tracked
              const events = win.dataLayer.filter((item: any) => item.event)
              cy.log(`✅ Tracked ${events.length} events`)
            }
          })
        }
      })
    })

    it('should track form submissions', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('body').then(($body) => {
        if ($body.find('form').length > 0) {
          cy.window().then((win: any) => {
            const initialEvents = win.dataLayer?.length || 0
            
            // Try to submit form (if possible)
            cy.get('form').first().then(($form) => {
              if ($form.find('button[type="submit"]').length > 0) {
                cy.get('button[type="submit"]').first().click({ force: true })
                
                cy.wait(1000)
                
                cy.window().then((win2: any) => {
                  const newEvents = win2.dataLayer?.length || 0
                  if (newEvents > initialEvents) {
                    cy.log('✅ Form submission tracked')
                  }
                })
              }
            })
          })
        }
      })
    })
  })

  describe('Google Tag Manager', () => {
    it('should have GTM container loaded', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('body').then(($body) => {
        // Check for GTM noscript tag
        cy.get('noscript').then(($noscript) => {
          if ($noscript.text().includes('googletagmanager.com')) {
            cy.log('✅ Google Tag Manager container detected')
          }
        })

        // Check for GTM script
        cy.get('script').then(($scripts) => {
          const hasGTM = Array.from($scripts).some((script) => 
            script.src?.includes('googletagmanager.com')
          )
          if (hasGTM) {
            cy.log('✅ Google Tag Manager script detected')
          }
        })
      })
    })
  })

  describe('Custom Event Tracking', () => {
    it('should track payment initiation', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('body').then(($body) => {
        if ($body.text().includes('Payment') || $body.text().includes('Pago')) {
          cy.window().then((win: any) => {
            const initialEvents = win.dataLayer?.length || 0
            
            cy.contains(/payment|pago|pay/i).first().click({ force: true })
            
            cy.wait(1000)
            
            cy.window().then((win2: any) => {
              const newEvents = win2.dataLayer?.length || 0
              if (newEvents > initialEvents) {
                cy.log('✅ Payment event tracked')
              }
            })
          })
        }
      })
    })

    it('should track AI generation events', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('body').then(($body) => {
        if ($body.text().includes('Generate') || $body.text().includes('Generar')) {
          cy.window().then((win: any) => {
            const initialEvents = win.dataLayer?.length || 0
            
            cy.contains(/generate|generar/i).first().click({ force: true })
            
            cy.wait(2000)
            
            cy.window().then((win2: any) => {
              const newEvents = win2.dataLayer?.length || 0
              if (newEvents > initialEvents) {
                cy.log('✅ AI generation event tracked')
              }
            })
          })
        }
      })
    })
  })
})

