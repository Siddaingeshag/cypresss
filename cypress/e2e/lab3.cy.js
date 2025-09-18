// cypress/e2e/orangehrm-data-driven-fixture.cy.js
 
// Load fixture data SYNCHRONOUSLY
const testCases = require('../fixtures/loginTestCases.json');
 
describe('OrangeHRM Login - Data Driven Test (Fixture)', () => {
  beforeEach(() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });
 
  testCases.forEach((testCase) => {
    it(`Login Test: ${testCase.testName}`, () => {
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
 
      if (testCase.expectedResult === 'success') {
        cy.url({ timeout: 10000 }).should('include', '/dashboard');
        cy.get('.oxd-topbar-header-title').should('contain', 'Dashboard');
        cy.get('.oxd-userdropdown-tab').should('be.visible');
      } else if (testCase.expectedResult === 'failure') {
        // For invalid credentials
        cy.get('.oxd-alert-content-text', { timeout: 10000 })
          .should('be.visible')
          .and('contain', 'Invalid credentials');
        cy.url().should('include', '/auth/login');
      } else if (testCase.expectedResult === 'failure_empty_username') {
        // For empty username
        cy.get('input[name="username"]')
          .closest('.oxd-input-group')
          .find('.oxd-text.oxd-input-field-error-message')
          .should('contain', 'Required')
          .and('be.visible');
        cy.url().should('include', '/auth/login');
      } else if (testCase.expectedResult === 'failure_empty_password') {
        // For empty password
        cy.get('input[name="password"]')
          .closest('.oxd-input-group')
          .find('.oxd-text.oxd-input-field-error-message')
          .should('contain', 'Required')
          .and('be.visible');
        cy.url().should('include', '/auth/login');
      }
    });
  });
});