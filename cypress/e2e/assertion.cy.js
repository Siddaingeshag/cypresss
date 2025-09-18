/// <reference types="cypress" />

describe('Saucedemo — Assertions Demo (Each Type Used Once)', () => {

  before(() => {
    cy.visit('https://www.saucedemo.com/');
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.contains('Products').should('be.visible');
  });

  it('demonstrates all assertion types exactly once in a simple flow', () => {

    // ========== 1. Existence & Visibility ==========
    cy.get('.inventory_list').should('exist');                    // ✅ 'exist'
    cy.get('.inventory_item').first().should('be.visible');       // ✅ 'be.visible'

    // ========== 2. Text Content ==========
    cy.get('.title').should('have.text', 'Products');             // ✅ 'have.text'
    cy.get('.inventory_item_name').first().should('contain', 'Backpack'); // ✅ 'contain' (substring)

    // Bonus: Use 'match' for price format
    cy.get('.inventory_item_price').first().should('match', /^\$\d+\.\d{2}$/); // ✅ 'match' (regex)

    // ========== 3. Attribute & Class ==========
    cy.get('[data-test="product-sort-container"]').should('have.attr', 'data-test', 'product-sort-container'); // ✅ 'have.attr' with value
    cy.get('.btn_inventory').first().should('have.class', 'btn'); // ✅ 'have.class'

    // ========== 4. Input Value & Checked State ==========
    // Go to checkout to test input value
    cy.get('.btn_inventory').first().click(); // Add first item
    cy.get('.shopping_cart_link').click();
    cy.contains('Checkout').click();

    cy.get('[data-test="firstName"]').type('John');
    cy.get('[data-test="firstName"]').should('have.value', 'John'); // ✅ 'have.value'

    // ========== 5. Length ==========
    cy.get('.inventory_item').should('have.length.greaterThan', 3); // ✅ 'have.length.greaterThan'

    // ========== 6. Chaining with .and() ==========
    cy.get('[data-test="continue"]').should('be.visible')
      .and('have.text', 'Continue')
      .and('not.have.class', 'disabled'); // ✅ chaining with .and()

    // ========== 7. Asserting Against a Function ==========
    cy.get('.inventory_item_name').should(($items) => {
      expect($items).to.have.length.greaterThan(0);     // ✅ function assertion with expect
      expect($items.first()).to.contain('Backpack');
    });

    // ========== 8. Asserting on URL ==========
    cy.url().should('include', '/checkout-step-one.html'); // ✅ URL assertion

    // ========== 9. Asserting on Window / localStorage (optional) ==========
    cy.window().should('have.property', 'localStorage');   // ✅ window property

    // Submit to see final page
    cy.get('[data-test="lastName"]').type('Doe');
    cy.get('[data-test="postalCode"]').type('12345');
    cy.get('[data-test="continue"]').click();
    cy.contains('Finish').click();

    cy.contains('Thank you for your order!').should('be.visible');

  });
});
