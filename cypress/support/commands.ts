/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to wait for Clerk authentication to load
       * @example cy.waitForClerk()
       */
      waitForClerk(): Chainable<void>
      
      /**
       * Custom command to upload images
       * @example cy.uploadImages(['image1.jpg', 'image2.jpg'])
       */
      uploadImages(files: string[]): Chainable<void>
    }
  }
}

Cypress.Commands.add('waitForClerk', () => {
  cy.wait(2000) // Wait for Clerk to initialize
})

Cypress.Commands.add('uploadImages', (files: string[]) => {
  // This is a placeholder - implement based on your upload component
  files.forEach((file) => {
    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${file}`, { force: true })
  })
})

export {}

