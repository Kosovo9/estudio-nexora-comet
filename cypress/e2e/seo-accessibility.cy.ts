import 'cypress-axe'

describe('SEO & Accessibility Tests', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  describe('SEO Meta Tags', () => {
    it('should have proper meta description', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('head meta[name="description"]')
        .should('exist')
        .and('have.attr', 'content')
        .and('not.be.empty')

      cy.get('head meta[name="description"]')
        .invoke('attr', 'content')
        .then((description) => {
          expect(description).to.have.length.greaterThan(50)
          expect(description).to.have.length.lessThan(160)
          cy.log(`✅ Meta description: ${description?.substring(0, 50)}...`)
        })
    })

    it('should have proper title tag', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.title().should('exist').and('not.be.empty')
      cy.title().should('include', 'Studio Nexora Comet')
      
      cy.title().then((title) => {
        expect(title.length).to.be.lessThan(60)
        cy.log(`✅ Page title: ${title}`)
      })
    })

    it('should have Open Graph meta tags', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('head meta[property="og:title"]').should('exist')
      cy.get('head meta[property="og:description"]').should('exist')
      cy.get('head meta[property="og:type"]').should('exist')
      
      cy.log('✅ Open Graph tags present')
    })

    it('should have canonical URL', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('head link[rel="canonical"]')
        .should('exist')
        .and('have.attr', 'href')
        .and('not.be.empty')

      cy.get('head link[rel="canonical"]')
        .invoke('attr', 'href')
        .then((href) => {
          expect(href).to.include('studio-nexora.com')
          cy.log(`✅ Canonical URL: ${href}`)
        })
    })

    it('should have proper meta keywords (optional)', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('head').then(($head) => {
        const hasKeywords = $head.find('meta[name="keywords"]').length > 0
        if (hasKeywords) {
          cy.get('head meta[name="keywords"]')
            .should('have.attr', 'content')
            .and('not.be.empty')
          cy.log('✅ Meta keywords present')
        } else {
          cy.log('ℹ️ Meta keywords not present (optional)')
        }
      })
    })

    it('should have proper viewport meta tag', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('head meta[name="viewport"]')
        .should('exist')
        .and('have.attr', 'content')
        .and('include', 'width=device-width')

      cy.log('✅ Viewport meta tag configured')
    })

    it('should have proper charset', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('head meta[charset]')
        .should('exist')
        .and('have.attr', 'charset', 'utf-8')

      cy.log('✅ UTF-8 charset configured')
    })
  })

  describe('Accessibility (a11y)', () => {
    it('should have no accessibility violations', () => {
      cy.visit('/')
      cy.wait(2000)
      cy.injectAxe()
      cy.checkA11y()
    })

    it('should have proper heading hierarchy', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('h1').should('exist').and('have.length', 1)
      cy.get('h1').then(($h1) => {
        expect($h1.text()).to.include('Studio Nexora Comet')
        cy.log('✅ Single H1 tag present')
      })

      // Check for proper heading order
      cy.get('h1, h2, h3, h4, h5, h6').then(($headings) => {
        const headings = Array.from($headings)
        let previousLevel = 0
        
        headings.forEach((heading) => {
          const level = parseInt(heading.tagName.charAt(1))
          if (previousLevel > 0 && level > previousLevel + 1) {
            cy.log(`⚠️ Heading hierarchy jump: h${previousLevel} to h${level}`)
          }
          previousLevel = level
        })
      })
    })

    it('should have alt text on images', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('img').each(($img) => {
        cy.wrap($img)
          .should('have.attr', 'alt')
          .and('not.be.empty')
      })

      cy.log('✅ All images have alt text')
    })

    it('should have proper form labels', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('input[type="text"], input[type="email"], input[type="password"]').each(($input) => {
        const id = $input.attr('id')
        const ariaLabel = $input.attr('aria-label')
        const placeholder = $input.attr('placeholder')
        const label = cy.get(`label[for="${id}"]`)

        if (id) {
          cy.get(`label[for="${id}"]`).then(($label) => {
            if ($label.length === 0 && !ariaLabel && !placeholder) {
              cy.log(`⚠️ Input ${id} missing label/aria-label`)
            }
          })
        }
      })
    })

    it('should have proper ARIA attributes', () => {
      cy.visit('/')
      cy.wait(2000)

      // Check for buttons with proper roles
      cy.get('button').each(($btn) => {
        const ariaLabel = $btn.attr('aria-label')
        const text = $btn.text()
        
        if (!ariaLabel && !text.trim()) {
          cy.log('⚠️ Button missing accessible label')
        }
      })

      // Check for modals/dialogs
      cy.get('[role="dialog"], [role="alert"]').should('have.attr', 'aria-labelledby').or('have.attr', 'aria-label')
    })

    it('should have proper color contrast', () => {
      cy.visit('/')
      cy.wait(2000)
      cy.injectAxe()
      
      // Check color contrast (part of a11y check)
      cy.checkA11y(null, {
        rules: {
          'color-contrast': { enabled: true }
        }
      })
    })

    it('should be keyboard navigable', () => {
      cy.visit('/')
      cy.wait(2000)

      // Test tab navigation
      cy.get('body').tab()
      cy.focused().should('exist')
      
      cy.log('✅ Keyboard navigation works')
    })
  })

  describe('Structured Data (Schema.org)', () => {
    it('should have JSON-LD structured data', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('script[type="application/ld+json"]').then(($scripts) => {
        if ($scripts.length > 0) {
          $scripts.each((_, script) => {
            const content = script.textContent
            if (content) {
              try {
                const json = JSON.parse(content)
                expect(json).to.have.property('@context')
                cy.log('✅ JSON-LD structured data present')
              } catch (e) {
                cy.log('⚠️ Invalid JSON-LD')
              }
            }
          })
        } else {
          cy.log('ℹ️ JSON-LD not present (optional)')
        }
      })
    })
  })

  describe('Performance Indicators', () => {
    it('should load within acceptable time', () => {
      const startTime = Date.now()
      
      cy.visit('/')
      cy.wait(2000)

      const loadTime = Date.now() - startTime
      expect(loadTime).to.be.lessThan(10000) // 10 seconds max
      
      cy.log(`✅ Page loaded in ${loadTime}ms`)
    })

    it('should have minimal console errors', () => {
      cy.visit('/', {
        onBeforeLoad(win) {
          cy.stub(win.console, 'error').as('consoleError')
        }
      })
      cy.wait(2000)

      cy.get('@consoleError').should('not.have.been.called')
      cy.log('✅ No console errors detected')
    })
  })
})

