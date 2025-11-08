describe('Bilingual Flow Tests - ES/EN', () => {
  const languages = ['es', 'en'] as const

  languages.forEach((lang) => {
    describe(`Language: ${lang.toUpperCase()}`, () => {
      beforeEach(() => {
        cy.clearCookies()
        cy.clearLocalStorage()
      })

      it(`should display UI in ${lang}`, () => {
        cy.visit(`/?lang=${lang}`)
        cy.wait(2000)

        if (lang === 'es') {
          cy.contains(/Subir Fotos|Generar|Consentimiento/i).should('exist')
        } else {
          cy.contains(/Upload Photos|Generate|Consent/i).should('exist')
        }
      })

      it(`should generate photo and show UI in ${lang}`, () => {
        cy.visit(`/?lang=${lang}`)
        cy.wait(2000)

        cy.get('body').then(($body) => {
          if ($body.text().includes('Generate') || $body.text().includes('Generar')) {
            // Click generate
            cy.contains(lang === 'es' ? /Generar|generar/i : /Generate|generate/i).click({ force: true })

            // Verify generating message in correct language
            if (lang === 'es') {
              cy.contains(/Generando tu foto|generando/i, { timeout: 3000 }).should('exist')
              cy.contains(/Tiempo transcurrido|tiempo/i).should('exist')
            } else {
              cy.contains(/Generating your photo|generating/i, { timeout: 3000 }).should('exist')
              cy.contains(/Elapsed time|time/i).should('exist')
            })

            // Wait for completion
            cy.wait(16000, { log: false })

            // Verify success message in correct language
            if (lang === 'es') {
              cy.contains(/Tu foto está lista|lista|completada/i, { timeout: 5000 }).should('exist')
            } else {
              cy.contains(/Your photo is ready|ready|completed/i, { timeout: 5000 }).should('exist')
            })
          }
        })
      })

      it(`should show download button and disclaimer in ${lang}`, () => {
        cy.visit(`/?lang=${lang}`)
        cy.wait(2000)

        cy.get('body').then(($body) => {
          if ($body.text().includes('Download') || $body.text().includes('Descargar')) {
            // Verify download button
            if (lang === 'es') {
              cy.contains(/Descargar Foto|Descargar/i).should('exist')
            } else {
              cy.contains(/Download Photo|Download/i).should('exist')
            })

            // Verify disclaimer
            if (lang === 'es') {
              cy.contains(/Aviso legal|24 horas|eliminan/i, { timeout: 5000 }).should('exist')
            } else {
              cy.contains(/Disclaimer|24 hours|deleted/i, { timeout: 5000 }).should('exist')
            })
          }
        })
      })

      it(`should show language switcher and change language`, () => {
        cy.visit(`/?lang=${lang}`)
        cy.wait(2000)

        // Find language buttons
        cy.get('button').contains(lang === 'es' ? 'EN' : 'ES').click({ force: true })
        cy.wait(1000)

        // Verify language changed
        const otherLang = lang === 'es' ? 'en' : 'es'
        if (otherLang === 'es') {
          cy.contains(/Subir Fotos|Generar/i, { timeout: 2000 }).should('exist')
        } else {
          cy.contains(/Upload Photos|Generate/i, { timeout: 2000 }).should('exist')
        }
      })

      it(`should show timer and progress in ${lang}`, () => {
        cy.visit(`/?lang=${lang}`)
        cy.wait(2000)

        cy.get('body').then(($body) => {
          if ($body.find('button').text().includes('Generate') || 
              $body.find('button').text().includes('Generar')) {
            cy.contains(lang === 'es' ? /Generar/i : /Generate/i).click({ force: true })

            // Verify timer
            if (lang === 'es') {
              cy.contains(/Tiempo transcurrido/i, { timeout: 2000 }).should('exist')
            } else {
              cy.contains(/Elapsed time/i, { timeout: 2000 }).should('exist')
            })

            // Verify progress bar
            cy.get('.bg-gray-700.rounded-full, [class*="progress"]', { timeout: 2000 }).should('exist')

            // Wait and verify timer increments
            cy.wait(3000)
            cy.contains(/\d+s|\d+m \d+s/).should('exist')
          }
        })
      })

      it(`should show timeout message in ${lang}`, () => {
        cy.visit(`/?lang=${lang}`)
        cy.wait(2000)

        cy.get('body').then(($body) => {
          if ($body.find('button').text().includes('Generate')) {
            cy.contains(lang === 'es' ? /Generar/i : /Generate/i).click({ force: true })

            // Wait for potential timeout
            cy.contains(
              lang === 'es'
                ? /tardando demasiado|verifica tu conexión/i
                : /taking too long|check your connection/i,
              { timeout: 25000 }
            ).then(($el) => {
              if ($el.length > 0) {
                cy.log(`✅ Timeout message displayed in ${lang}`)
              }
            })
          }
        })
      })
    })
  })

  describe('Language Switching', () => {
    it('should persist language preference', () => {
      cy.visit('/?lang=es')
      cy.wait(2000)

      // Switch to EN
      cy.get('button').contains('EN').click({ force: true })
      cy.wait(1000)

      // Reload page
      cy.reload()
      cy.wait(2000)

      // Should remember EN preference
      cy.contains(/Upload Photos|Generate/i).should('exist')
    })
  })
})

