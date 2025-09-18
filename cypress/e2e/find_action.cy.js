/// <reference types="cypress" />

describe('Saucedemo — Use All Commands Once (Split into Multiple it Blocks)', () => {

  before(() => {
    cy.visit('https://www.saucedemo.com/');
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.contains('Products').should('be.visible');
  });

  it('verifies first product and adds last product to cart', () => {
    // 1. cy.get()
    cy.get('.inventory_list')
      // 3. .find()
      .find('.inventory_item_name')
      // 4. .first()
      .first()
      .should('contain', 'Sauce Labs Backpack');

    // 2. cy.contains()
    cy.contains('Add to cart')
      // 5. .last()
      .last()
      // 6. .click()
      .click();

    // ✅ Wait for button to change to "Remove" to confirm item added
    cy.contains('Remove').should('be.visible');
  });

  it('sorts products and navigates to checkout', () => {
    // ✅ Ensure we're still on Products page
    cy.contains('Products').should('be.visible');

    // 10. .select()
    cy.get('[data-test="product-sort-container"]').select('lohi');

    // Go to cart
    cy.get('.shopping_cart_link').click();

    // Proceed to checkout
    cy.contains('Checkout').click();
  });

  it('fills checkout form and triggers event', () => {
    // 7. .clear()
    cy.get('[data-test="firstName"]').type('John').clear().type('Jane');

    cy.get('[data-test="lastName"]').type('Doe');
    cy.get('[data-test="postalCode"]').type('12345');

    // 11. .trigger()
    cy.get('[data-test="postalCode"]').trigger('focus');
  });

  it('submits order and verifies success message', () => {
    cy.get('[data-test="continue"]').click();
    cy.contains('Finish').click();
    cy.contains('Thank you for your order!').should('be.visible');
  });

  // ⚠️ .check() / .uncheck() — NOT used
  // Saucedemo has no checkboxes → skip with comment
});