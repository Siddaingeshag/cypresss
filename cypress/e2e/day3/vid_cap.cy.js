describe('OrangeHRM Video Examples', () => {
it('completes a full user journey', () => {
// This entire test will be recorded
cy.visit('/web/index.php/auth/login');
// Login
cy.get('input[name="username"]').type('Admin');
cy.get('input[name="password"]').type('admin123');
cy.get('button[type="submit"]').click();
// Verify dashboard
cy.url().should('include', '/dashboard');
// Navigate to Admin section
cy.get('.oxd-sidepanel').contains('Admin').click();
cy.url().should('include', '/admin/viewSystemUsers');
// Navigate to PIM
cy.get('.oxd-sidepanel').contains('PIM').click();
cy.url().should('include', '/pim/viewEmployeeList');
});
});