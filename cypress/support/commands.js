/*Cypress.Commands.add('login', (username, password) => {
 
cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
 
 
 cy.get('input[name="username"]').type(username)
 cy.get('input[name="password"]').type(password)
 cy.get('button[type="submit"]').click()
})*/
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return config;
    },
    // SCREENSHOT SETTINGS
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
  },
  
  // Reporter configuration
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true,
    charts: true,
    reportPageTitle: 'OrangeHRM Test Report',
    inlineAssets: true,
  },
});