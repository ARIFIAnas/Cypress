
import sauce from'../fixtures/saucedemo.json'

    context("Navigate in sauce demo website", () => {
        describe("Login and Logout with valid username and password", () => {
            it("go to website and Login then logout", () => {
                cy.visit(sauce.url)
                cy.get('#user-name').type(sauce.username)
                cy.get('#password').type(sauce.password)
                cy.get('#login-button').click()
                cy.url().should('eq', sauce.PRODUCTS_PAGE_URL)
                cy.get('#react-burger-menu-btn').click()
                cy.wait(3)
                cy.get('#logout_sidebar_link').click()
        })
        })
        describe("Login with locked account", () => {
            it("Login with locked account", () => {
                cy.visit(sauce.url)
                cy.get('#user-name').type(sauce.locked_username)
                cy.get('#password').type(sauce.password)
                cy.get('#login-button').click()
                cy.get(' div.error-message-container.error > h3').contains('Epic sadface: Sorry, this user has been locked out.').should('be.visible')
        })
        })
        describe("Navigate in sauce demo", () => {
            beforeEach(() => {
                cy.visit(sauce.url)
                cy.get('#user-name').type(sauce.username)
                cy.get('#password').type(sauce.password)
                cy.get('#login-button').click()
        })
            it("sort the product list from highest to lowest price", () => {
                //sort the product list from highest to lowest price
                cy.get('select').select('Price (high to low)')
                cy.get(".active_option").should('have.text','Price (high to low)')
                //add the first two products to the cart
                cy.get('.btn').should('have.length', 6).as('addToCartButtons');
                cy.get('@addToCartButtons').eq(0).click();
                cy.get('#add-to-cart-sauce-labs-backpack').click();
                cy.get('.shopping_cart_badge').should('have.text', '2');
                //go to cart
                cy.get("#shopping_cart_container").click()
                cy.url().should('eq', sauce.cart_url)
                //check that I have two products in the basket
                cy.get('#shopping_cart_container > a > span').should('have.text','2')
                cy.get('#item_5_title_link').should('have.text','Sauce Labs Fleece Jacket')
                cy.get('#item_4_title_link').should('have.text','Sauce Labs Backpack')
                //enter the customer information firstname and lastname and zipcode
                cy.get('#checkout').click()
                cy.url().should('eq', sauce.checkout_url)
                cy.get('#first-name').type(sauce.fname)
                cy.get('#last-name').type(sauce.lname)
                cy.get('#postal-code').type(sauce.zcode)
                cy.wait(3)
                //finalize the order
                cy.get('#continue').click()
                cy.url().should('eq', sauce.confirm_url)
                cy.contains('.title','Checkout: Overview')
                cy.contains('.summary_info_label','Shipping Information:')
                cy.get('#finish').click()
                cy.url().should('eq', sauce.complete_url)
                cy.contains('.title','Checkout: Complete!')
                cy.contains('#checkout_complete_container','Thank you for your order!').should('be.visible')
                cy.contains('#back-to-products','Back Home').should('be.visible')
        })
            it("list and verify hilo and lohi", () => {
                cy.url().should('eq', sauce.PRODUCTS_PAGE_URL)
                cy.get('select').select('Price (high to low)')//hilo
                cy.get(".active_option").should('have.text','Price (high to low)')
                var prices = []
                cy.get('.inventory_item_price').each(($el) => {
                prices.push($el.text()) 
                cy.log($el.text())
                const sortedPrices = [...prices].sort((a, b) => b - a)
                expect(prices).to.deep.equal(sortedPrices)
                })
                cy.get('select').select('Price (low to high)')//lohi
                cy.get(".active_option").should('have.text','Price (low to high)')
                const listToCompare = ['7.99', '9.99', '15.99', '15.99', '29.99', '49.99']
                let PricesToCompare = [];
                cy.get('.inventory_item_price').each(($el, index) => {
                    if (index < 6) {
                        cy.wrap($el).invoke('text').then((text) => {
                          const price = text.trim().replace('$', '')
                          PricesToCompare.push(price);
                          if (index === 5) {
                            PricesToCompare.sort((a, b) => parseFloat(a) - parseFloat(b))
                            expect(PricesToCompare).to.deep.equal(listToCompare)
                            }
                        })
                      }
                }) 
            })   
            it.only("Cas de test 5", () => {
                cy.get('#item_0_title_link').click()
                //button
                cy.get('#add-to-cart').should('have.attr', 'name')
                cy.get('#add-to-cart').should('be.visible')
                //titre
                cy.get('[data-test="inventory-item-name"]').should("have.text","Sauce Labs Bike Light")
                //description
                cy.get('[class="inventory_details_desc large_size"]').should('have.text', "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.")
                //tagPrice
                cy.get('[data-test="inventory-item-price"]').should('have.text','$9.99')
                //image
                cy.get('[alt="Sauce Labs Bike Light"]').should('be.visible')
                //add to cart
                cy.get('#add-to-cart').click()
                cy.get('.shopping_cart_badge').should('have.text', '1')
                cy.get('.shopping_cart_badge').click()
                cy.get('[data-test="inventory-item-name"]').should("have.text",'Sauce Labs Bike Light')
                //remove button 
                cy.contains('#remove-sauce-labs-bike-light','Remove').should('be.visible')
                //quantity
                cy.get('[data-test="item-quantity"]').should('have.text', '1') 

            })
    
        })

})