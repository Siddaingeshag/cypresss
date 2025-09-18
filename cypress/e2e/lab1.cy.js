describe('OrangeHRM Login with Fixture', () => {
 it('should login using fixture data', () => {
 
cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
 
 // This will use the overwritten type command and show console logs
 cy.fixture('users').then((userData) => {
 cy.get('input[name="username"]').type(userData.username);
 // Console: "Typing: 'Admin'"
 
 cy.get('input[name="password"]').type(userData.password);
 // Console: "Typing: 'admin123'"
 });
 
 cy.get('button[type="submit"]').click();
 
 // Verify successful login
 cy.url().should('include', '/dashboard');
 cy.get('.oxd-topbar-header-title').should('contain', 'Dashboard');
 });
});