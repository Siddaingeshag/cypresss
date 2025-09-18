describe('Basic Website Navigation and Assertion', () => {
   it('should successfully load the homepage and verify its title', () => {
       // Arrange: Visit the application's base URL
       cy.visit('https://example.cypress.io');
       // Act: No specific action needed beyond visiting for this test, but you could add interactions here.
       // Assert: Verify the page title
       cy.title().should('eq', 'Cypress.io: Kitchen Sink');
   });



});