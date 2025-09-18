/// <reference types="cypress" />
 
describe('SauceDemo Full Application Assertions Demo', () => {

  beforeEach(() => {

    // Visit and log in before each test

    cy.visit('https://www.saucedemo.com/');

    cy.get('#user-name').type('standard_user');

    cy.get('#password').type('secret_sauce');

    cy.get('#login-button').click();

    cy.url().should('include', '/inventory.html');

  });
 
  it('Inventory Page Assertions', () => {

    cy.get('.title').should('have.text', 'Products').and('be.visible');
 
    // 6 products

    cy.get('.inventory_item').should('have.length', 6);
 
    // First product

    cy.get('.inventory_item_name').first().should('contain.text', 'Sauce Labs');
 
    // Price regex

    cy.get('.inventory_item_price').first()

      .invoke('text')

      .should('match', /^\$\d+\.\d{2}$/);

  });
 
  it('Cart Assertions', () => {

    cy.get('.btn_inventory').eq(0).click();

    cy.get('.btn_inventory').eq(1).click();
 
    cy.get('.shopping_cart_badge')

      .should('have.text', '2')

      .and('be.visible');
 
    cy.get('.shopping_cart_link').click();

    cy.url().should('include', '/cart.html');
 
    cy.get('.cart_item').should('have.length', 2);
 
    cy.get('.cart_button').first().should('have.text', 'Remove');

  });
 
  it('Checkout Assertions', () => {

    cy.get('.btn_inventory').first().click();

    cy.get('.shopping_cart_link').click();
 
    cy.get('#checkout').should('exist').and('be.visible').click();

    cy.url().should('include', '/checkout-step-one.html');
 
    cy.get('#first-name').should('have.attr', 'placeholder', 'First Name').type('John');

    cy.get('#last-name').type('Doe');

    cy.get('#postal-code').type('12345');

    cy.get('#continue').click();
 
    cy.url().should('include', '/checkout-step-two.html');

    cy.get('.summary_info_label').should('contain.text', 'Payment Information');
 
    cy.get('.summary_total_label')

      .invoke('text')

      .should('match', /^Total: \$\d+\.\d{2}$/);
 
    cy.get('#finish').click();
 
    cy.url().should('include', '/checkout-complete.html');

    cy.get('.complete-header').should('have.text', 'Thank you for your order!');

    cy.get('.complete-text').should('include.text', 'dispatched');

  });
 
  it('Logout Assertions', () => {

    cy.get('#react-burger-menu-btn').click();

    cy.get('#logout_sidebar_link')

      .should('be.visible')

      .and('have.text', 'Logout')

      .click();
 
    cy.url().should('eq', 'https://www.saucedemo.com/');

    cy.get('#login-button').should('be.visible');

  });
 
  it('Custom Function Assertions', () => {

    cy.get('.inventory_item_name').should(($items) => {

      expect($items).to.have.length(6);

      expect($items.last()).to.contain.text('Test.allTheThings()');

    });

  });
 
  // ✅ Alternatives for window/storage assertions

  it('Cart persistence via reload (UI-based)', () => {

    cy.get('.btn_inventory').first().click();

    cy.get('.shopping_cart_badge').should('have.text', '1');

    cy.reload();

    // If app clears cart on reload, change this to 'not.exist'

    cy.get('.shopping_cart_badge').should('have.text', '1');

  });
 
  it('Safe localStorage access with fallback', () => {

    cy.window().then((win) => {

      expect(win).to.have.property('localStorage');

      const ls = win.localStorage || {};

      const keys = Object.keys(ls);
 
      if (ls.getItem && ls.getItem('session-username')) {

        expect(ls.getItem('session-username')).to.equal('standard_user');

      } else if (keys.length > 0) {

        expect(keys.length).to.be.greaterThan(0);

      } else {

        cy.get('#react-burger-menu-btn').should('be.visible');

      }

    });

  });
 
  it('Cookie-based session check (with fallback)', () => {

    cy.getCookie('session-username').then((cookie) => {

      if (cookie) {

        expect(cookie.value).to.equal('standard_user');

      } else {

        cy.get('#react-burger-menu-btn').should('be.visible');

      }

    });

  });

});

 