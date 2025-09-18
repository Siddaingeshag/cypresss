// cypress/e2e/orangehrm-data-driven-array.cy.js
 
describe('OrangeHRM Data-Driven Login Tests (JS Array)', () => {
  const testCases = [
    {
      username: 'Admin',
      password: 'admin123',
      expected: 'success',
      description: 'Valid credentials'
    },
    {
      username: 'InvalidUser',
      password: 'wrongpassword',
      expected: 'failure',
      description: 'Invalid credentials'
    },
    {
      username: '',
      password: 'admin123',
      expected: 'failure_empty_username',
      description: 'Empty username'
    },
    {
      username: 'Admin',
      password: '',
      expected: 'failure_empty_password',
      description: 'Empty password'
    }
  ];
 
  testCases.forEach((testCase) => {
    it(`should handle login for: ${testCase.description}`, () => {
      cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
 
      // Wait for inputs to be visible
      cy.get('input[name="username"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
 
      // Handle username
      cy.get('input[name="username"]').clear();
      if (testCase.username) {
        cy.get('input[name="username"]').type(testCase.username);
      }
 
      // Handle password
      cy.get('input[name="password"]').clear();
      if (testCase.password) {
        cy.get('input[name="password"]').type(testCase.password);
      }
 
      cy.get('button[type="submit"]').click();
 
      // Validate outcome based on expected type
      if (testCase.expected === 'success') {
        cy.url({ timeout: 10000 }).should('include', '/dashboard');
        cy.get('.oxd-topbar-header-title').should('contain', 'Dashboard');
        cy.get('.oxd-userdropdown-tab').should('be.visible');
      } else if (testCase.expected === 'failure') {
        // For invalid credentials (wrong username/password)
        cy.get('.oxd-alert-content-text', { timeout: 10000 })
          .should('be.visible')
          .and('contain', 'Invalid credentials');
        cy.url().should('include', '/auth/login');
      } else if (testCase.expected === 'failure_empty_username') {
        // For empty username
        cy.get('input[name="username"]')
          .closest('.oxd-input-group') // Find parent container
          .find('.oxd-text.oxd-input-field-error-message') // Find error message
          .should('contain', 'Required')
          .and('be.visible');
 
        // Should remain on login page
        cy.url().should('include', '/auth/login');
      } else if (testCase.expected === 'failure_empty_password') {
        // For empty password
        cy.get('input[name="password"]')
          .closest('.oxd-input-group')
          .find('.oxd-text.oxd-input-field-error-message')
          .should('contain', 'Required')
          .and('be.visible');
 
        // Should remain on login page
        cy.url().should('include', '/auth/login');
      }
    });
  });
});