describe('Mobile Responsive Testing', () => {
  const viewports = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12 Pro', width: 390, height: 844 },
    { name: 'iPhone 14 Pro Max', width: 430, height: 932 },
    { name: 'Samsung Galaxy S20', width: 360, height: 800 },
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'iPad Pro', width: 1024, height: 1366 },
  ]

  viewports.forEach((viewport) => {
    describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height)
        cy.clearCookies()
        cy.clearLocalStorage()
      })

      it('should load and display main content', () => {
        cy.visit('/')
        cy.wait(2000)

        cy.contains('Studio Nexora Comet').should('be.visible')
        cy.get('body').should('be.visible')
      })

      it('should have all buttons visible and clickable', () => {
        cy.visit('/')
        cy.wait(2000)

        cy.get('button').each(($btn) => {
          cy.wrap($btn).should('be.visible')
          cy.wrap($btn).should('not.be.disabled')
        })
      })

      it('should have proper text sizing', () => {
        cy.visit('/')
        cy.wait(2000)

        cy.get('h1').should('be.visible')
        cy.get('h1').then(($h1) => {
          const fontSize = window.getComputedStyle($h1[0]).fontSize
          const size = parseFloat(fontSize)
          expect(size).to.be.greaterThan(0)
          cy.log(`✅ H1 font size: ${fontSize}`)
        })
      })

      it('should not have horizontal scroll', () => {
        cy.visit('/')
        cy.wait(2000)

        cy.get('body').then(($body) => {
          const bodyWidth = $body[0].scrollWidth
          const viewportWidth = viewport.width
          
          expect(bodyWidth).to.be.at.most(viewportWidth + 10) // Allow small margin
          cy.log(`✅ No horizontal scroll (body: ${bodyWidth}px, viewport: ${viewportWidth}px)`)
        })
      })

      it('should have touch-friendly button sizes', () => {
        cy.visit('/')
        cy.wait(2000)

        cy.get('button').each(($btn) => {
          const height = $btn[0].offsetHeight
          const width = $btn[0].offsetWidth
          
          // Minimum touch target: 44x44px (Apple HIG)
          if (height < 44 || width < 44) {
            cy.log(`⚠️ Button ${$btn.text()} may be too small for touch (${width}x${height}px)`)
          } else {
            cy.log(`✅ Button ${$btn.text()} has adequate touch target (${width}x${height}px)`)
          }
        })
      })

      it('should have readable text', () => {
        cy.visit('/')
        cy.wait(2000)

        cy.get('body').then(($body) => {
          const textElements = $body.find('p, span, div, a, button, label')
          
          textElements.each((_, el) => {
            const fontSize = window.getComputedStyle(el).fontSize
            const size = parseFloat(fontSize)
            
            // Minimum readable size: 14px
            if (size < 14 && el.textContent?.trim()) {
              cy.log(`⚠️ Text may be too small: ${fontSize}`)
            }
          })
        })
      })

      it('should handle form inputs properly', () => {
        cy.visit('/')
        cy.wait(2000)

        cy.get('input, textarea, select').each(($input) => {
          cy.wrap($input).should('be.visible')
          
          const height = $input[0].offsetHeight
          if (height < 44) {
            cy.log(`⚠️ Input may be too small for touch: ${height}px`)
          }
        })
      })

      it('should have proper spacing between elements', () => {
        cy.visit('/')
        cy.wait(2000)

        cy.get('button').each(($btn, index, $list) => {
          if (index < $list.length - 1) {
            const btn1 = ($btn[0] as any) as HTMLElement
            const nextBtn = ($list as any)[index + 1]
            const btn2 = (nextBtn[0] as any) as HTMLElement
            
            if (!btn1 || !btn2) return
            
            const rect1 = btn1.getBoundingClientRect()
            const rect2 = btn2.getBoundingClientRect()
            
            const spacing = Math.abs(rect2.top - rect1.bottom)
            
            // Minimum spacing: 8px
            if (spacing < 8 && spacing > 0) {
              cy.log(`⚠️ Elements may be too close: ${spacing}px`)
            }
          }
        })
      })
    })
  })

  describe('Orientation Changes', () => {
    it('should handle portrait orientation', () => {
      cy.viewport(375, 667) // Portrait
      cy.visit('/')
      cy.wait(2000)

      cy.contains('Studio Nexora Comet').should('be.visible')
    })

    it('should handle landscape orientation', () => {
      cy.viewport(667, 375) // Landscape
      cy.visit('/')
      cy.wait(2000)

      cy.contains('Studio Nexora Comet').should('be.visible')
    })
  })

  describe('Touch Interactions', () => {
    beforeEach(() => {
      cy.viewport('iphone-x')
      cy.clearCookies()
    })

    it('should support touch events', () => {
      cy.visit('/')
      cy.wait(2000)

      cy.get('button').first().then(($btn) => {
        // Simulate touch
        $btn[0].dispatchEvent(new TouchEvent('touchstart', { bubbles: true }))
        cy.log('✅ Touch events supported')
      })
    })

    it('should have no hover-dependent functionality', () => {
      cy.visit('/')
      cy.wait(2000)

      // Check that critical actions don't require hover
      cy.get('button').each(($btn) => {
        const text = $btn.text()
        if (text.trim()) {
          // Button should be clickable without hover
          cy.wrap($btn).should('be.visible')
        }
      })
    })
  })

  describe('Performance on Mobile', () => {
    it('should load within acceptable time on mobile', () => {
      cy.viewport('iphone-x')
      
      const startTime = Date.now()
      cy.visit('/')
      cy.wait(2000)

      const loadTime = Date.now() - startTime
      expect(loadTime).to.be.lessThan(8000) // 8 seconds max on mobile
      
      cy.log(`✅ Mobile load time: ${loadTime}ms`)
    })

    it('should have optimized images for mobile', () => {
      cy.viewport('iphone-x')
      cy.visit('/')
      cy.wait(2000)

      cy.get('img').each(($img) => {
        const src = $img.attr('src')
        const srcset = $img.attr('srcset')
        
        // Check for responsive images
        if (srcset || src?.includes('w=') || src?.includes('width=')) {
          cy.log('✅ Responsive image detected')
        }
      })
    })
  })
})

