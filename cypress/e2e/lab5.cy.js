/// <reference types="cypress" />
require('cypress-xpath');
 
// ================== PAGE OBJECTS ==================
 
class BasePage {
  goto(url) { cy.visit(url); }
  goBack() { cy.go('back'); }
  goForward() { cy.go('forward'); }
  reload() { cy.reload(); }
  waitForURL(url) { cy.url().should('include', url); }
}
 
class LoginPage extends BasePage {
  get usernameInput() { return cy.get('[data-test="username"]'); }
  get passwordInput() { return cy.get('[data-test="password"]'); }
  get loginButton() { return cy.get('[data-test="login-button"]'); }
  get swagLabsTitle() { return cy.contains('Swag Labs'); }
 
  login(username, password) {
    this.usernameInput.clear().type(username);
    this.passwordInput.clear().type(password);
    this.loginButton.should('be.enabled').click();
  }
 
  verifyLoginPageLoaded() {
    cy.get('.login_logo').should('exist').and('be.visible');
    this.swagLabsTitle.should('be.visible').and('have.text', 'Swag Labs');
  }
}
 
class InventoryPage extends BasePage {
  get productsHeader() { return cy.get('[data-test="primary-header"]'); }
  get sortDropdown() { return cy.get('[data-test="product-sort-container"]'); }
  get shoppingCartLink() { return cy.get('[data-test="shopping-cart-link"]'); }
  get shoppingCartBadge() { return cy.get('[data-test="shopping-cart-badge"]'); }
  get menuButton() { return cy.get('#react-burger-menu-btn'); }
  get closeMenuButton() { return cy.get('#react-burger-cross-btn'); }
 
  verifyInventoryPageLoaded() {
    this.productsHeader.should('contain', 'Swag Labs');
    cy.contains('Products').should('be.visible');
  }
 
  openAndCloseMenu() {
    this.menuButton.should('be.visible').click();
    this.closeMenuButton.should('be.visible').click();
  }
 
  sortProducts(option) {
    this.sortDropdown.should('exist').select(option);
    cy.get('.inventory_item').first().should('be.visible');
  }
 
  addItemToCartByDataTest(productName, dataTestValue) {
    cy.contains('.inventory_item', productName)
      .should('be.visible')
      .find(`[data-test="${dataTestValue}"]`)
      .should('be.visible')
      .and('have.text', 'Add to cart')
      .click();
  }
 
  getCartCount() {
    return this.shoppingCartBadge.should('exist').invoke('text');
  }
 
  goToCart() {
    this.shoppingCartLink
      .should('be.visible')
      .trigger('mouseover')
      .trigger('mouseenter')
      .click();
    cy.url().should('include', '/cart.html');
  }
 
  clickBackpackImage() {
    cy.xpath('//*[@id="item_4_img_link"]/img')
      .should('be.visible')
      .trigger('mousedown')
      .trigger('mouseup')
      .click();
  }
}
 
class ProductDetailsPage extends BasePage {
  get addToCartButton() { return cy.get('[data-test="add-to-cart"]'); }
  get productName() { return cy.get('[data-test="inventory-item-name"]'); }
  get productPrice() { return cy.get('[data-test="inventory-item-price"]'); }
 
  clickAddToCart() {
    this.addToCartButton.should('be.visible').click();
  }
 
  verifyProductDetails(expectedName, expectedPrice) {
    this.productName.should('contain', expectedName);
    this.productPrice
      .invoke('text')
      .should('match', /^\$\d+\.\d{2}$/)
      .and('contain', expectedPrice);
  }
}
 
class CartPage extends BasePage {
  get checkoutButton() { return cy.get('[data-test="checkout"]'); }
  get cartList() { return cy.get('[data-test="cart-list"]'); }
 
  clickCheckout() {
    cy.url().then(url => {
      if (url.includes('/cart.html')) {
        this.checkoutButton.should('be.visible').click();
        cy.url().should('include', '/checkout-step-one.html');
      } else {
        cy.log('Already on checkout step one, skipping checkout click');
      }
    });
  }
 
  verifyCartItem(productName, price) {
    this.cartList.should('contain', productName).and('contain', price);
  }
}
 
class CheckoutStepOnePage extends BasePage {
  get checkoutHeader() { return cy.get('.header_secondary_container'); }
  get firstNameInput() { return cy.get('[data-test="firstName"]'); }
  get lastNameInput() { return cy.get('[data-test="lastName"]'); }
  get postalCodeInput() { return cy.get('[data-test="postalCode"]'); }
  get continueButton() { return cy.get('[data-test="continue"]'); }
 
  fillInfo(firstName, lastName, postalCode) {
    if (!firstName || !lastName || !postalCode) {
      throw new Error(`❌ Missing checkout data. Got:
        firstName=${firstName},
        lastName=${lastName},
        postalCode=${postalCode}`);
    }
 
    this.checkoutHeader.should('contain', 'Checkout: Your Information');
    this.firstNameInput.clear().type(firstName);
    this.lastNameInput.clear().type(lastName);
    this.postalCodeInput.clear().type(postalCode);
    this.continueButton.should('be.enabled').click();
  }
}
 
class CheckoutStepTwoPage extends BasePage {
  get finishButton() { return cy.get('[data-test="finish"]'); }
  get overviewHeader() { return cy.get('.header_secondary_container'); }
 
  verifyOverviewPage() {
    this.overviewHeader.should('contain', 'Checkout: Overview');
  }
 
  clickFinish() {
    this.finishButton.should('be.visible').click();
  }
}
 
class CheckoutCompletePage extends BasePage {
  get completeHeader() { return cy.get('.header_secondary_container'); }
  get thankYouMessage() { return cy.get('[data-test="complete-header"]'); }
  get backHomeButton() { return cy.get('[data-test="back-to-products"]'); }
 
  verifyCompletePage() {
    this.completeHeader.should('contain', 'Checkout: Complete!');
    this.thankYouMessage.should('contain', 'Thank you for your order!');
  }
 
  clickBackHome() {
    
    this.backHomeButton.should('be.visible').click();
  }
}
 
// ================== TEST SUITE ==================
 
describe('Saucedemo Full Workflow Test', () => {
  const loginPage = new LoginPage();
  const inventoryPage = new InventoryPage();
  const productDetailsPage = new ProductDetailsPage();
  const cartPage = new CartPage();
  const checkoutOne = new CheckoutStepOnePage();
  const checkoutTwo = new CheckoutStepTwoPage();
  const checkoutComplete = new CheckoutCompletePage();
 
  // ---------- HOOKS ----------
  before(function() {
    cy.log('Starting Saucedemo Workflow Test Suite');
 
    // ONE-TIME SETUP: API seed example
    cy.request('GET', 'https://jsonplaceholder.typicode.com/users/1')
      .its('status')
      .should('eq', 200);
 
    // Load fixture for checkout info
   
  });
 
  beforeEach(function() {
    // Set consistent viewport
    cy.viewport(1280, 720);
 
    // fresh login before each test
    loginPage.goto('https://www.saucedemo.com/');
    loginPage.verifyLoginPageLoaded();
    loginPage.login('standard_user', 'secret_sauce');
    inventoryPage.verifyInventoryPageLoaded();
     cy.fixture('checkoutUser.json').as('userData');
  });
 
  afterEach(() => {
    cy.log('Test case completed ✔️');
  });
 
  after(() => {
    cy.log('All tests finished. Cleaning up if necessary.');
  });
 
  // ---------- INDIVIDUAL TEST CASES ----------
 
  it('should open and close sidebar menu', () => {
    inventoryPage.openAndCloseMenu();
  });
 
  it('should sort products from low to high price', () => {
    inventoryPage.sortProducts('lohi');
    // Optional: verify first item is cheapest
    cy.get('.inventory_item').first().contains('$7.99'); // cheapest item
  });
 
  it('should view backpack details and add to cart', () => {
    inventoryPage.clickBackpackImage();
    productDetailsPage.verifyProductDetails('Sauce Labs Backpack', '$29.99');
    productDetailsPage.clickAddToCart();
    cy.go('back');
    inventoryPage.verifyInventoryPageLoaded();
  });
 
  it('should add multiple items to cart from inventory page', () => {
    inventoryPage.addItemToCartByDataTest('Sauce Labs Bike Light', 'add-to-cart-sauce-labs-bike-light');
    inventoryPage.addItemToCartByDataTest('Sauce Labs Bolt T-Shirt', 'add-to-cart-sauce-labs-bolt-t-shirt');
    inventoryPage.getCartCount().should('equal', '2'); // Only 2 added here
  });
 
  it('should verify cart contents and proceed to checkout', () => {
    // First, add an item to ensure cart isn’t empty
    inventoryPage.addItemToCartByDataTest('Sauce Labs Bike Light', 'add-to-cart-sauce-labs-bike-light');
    inventoryPage.goToCart();
 
    cartPage.verifyCartItem('Sauce Labs Bike Light', '$9.99');
    cartPage.clickCheckout();
    cy.url().should('include', '/checkout-step-one.html');
  });
 
  it('should fill checkout information and proceed', function() {
    // Add item and go to checkout
    inventoryPage.addItemToCartByDataTest('Sauce Labs Backpack', 'add-to-cart-sauce-labs-backpack');
    inventoryPage.goToCart();
    cartPage.clickCheckout();
 
    // Fill info using fixture
    cy.get('@userData').then((userData) => {
      expect(userData.firstName, 'firstName in fixture').to.exist;
      expect(userData.lastName, 'lastName in fixture').to.exist;
      expect(userData.postalCode, 'postalCode in fixture').to.exist;
      checkoutOne.fillInfo(userData.firstName, userData.lastName, userData.postalCode);
    });
 
    checkoutTwo.verifyOverviewPage();
  });
 
  it('should complete checkout and return to inventory', () => {
    // Add item, go to checkout, fill info
    inventoryPage.addItemToCartByDataTest('Sauce Labs Backpack', 'add-to-cart-sauce-labs-backpack');
    inventoryPage.goToCart();
    cartPage.clickCheckout();
 
    cy.get('@userData').then((userData) => {
      checkoutOne.fillInfo(userData.firstName, userData.lastName, userData.postalCode);
    });
 
    // Finish checkout
    checkoutTwo.verifyOverviewPage();
    checkoutTwo.clickFinish();
    checkoutComplete.verifyCompletePage();
    checkoutComplete.clickBackHome();
    inventoryPage.verifyInventoryPageLoaded();
  });
 
  it('should demonstrate navigation: back, forward, reload during checkout', () => {
    inventoryPage.addItemToCartByDataTest('Sauce Labs Backpack', 'add-to-cart-sauce-labs-backpack');
    inventoryPage.goToCart();
    cartPage.clickCheckout();
 
    cy.go('back');
    cy.url().should('include', '/cart.html');
 
    cy.go('forward');
    cy.url().should('include', '/checkout-step-one.html');
 
    cy.reload();
    checkoutOne.checkoutHeader.should('contain', 'Checkout: Your Information');
  });
});