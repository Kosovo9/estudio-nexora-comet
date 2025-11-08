describe('API Endpoints Tests', () => {
  const baseUrl = Cypress.config().baseUrl || 'http://localhost:3000'

  describe('Upload API', () => {
    it('should require authentication for upload', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/api/upload`,
        body: { image: 'test', style: 'dark-studio' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  })

  describe('Payment APIs', () => {
    it('should require authentication for bank payment', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/api/payments/bank`,
        body: { accountName: 'Test' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401)
      })
    })

    it('should require authentication for Stripe payment', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/api/payments/stripe`,
        body: { imageUrl: 'test' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401)
      })
    })

    it('should handle webhook endpoint', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/api/payments/webhook`,
        body: { type: 'test' },
        failOnStatusCode: false,
      }).then((response) => {
        // Webhook should handle missing signature
        expect([400, 401]).to.include(response.status)
      })
    })
  })
})

