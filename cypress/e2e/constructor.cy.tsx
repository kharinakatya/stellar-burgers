describe('Constructor: Load ingredients', () => {
  beforeEach(() => {
  cy.clearLocalStorage()
  cy.clearCookies()

  cy.intercept('GET', '**/api/auth/user', {
    statusCode: 200,
    body: {
      success: true,
      user: {
        email: 'test@example.com',
        name: 'Test User'
      }
    }
  }).as('getUser')

  cy.intercept('GET', '**/api/ingredients', {
    fixture: 'ingredients.json'
  }).as('getIngredients')

  cy.visit('/', {
    onBeforeLoad: (win) => {
      win.localStorage.setItem('accessToken', 'mock-access-token')
      win.localStorage.setItem('refreshToken', 'mock-refresh-token')
    }
  })
})

  it('проверяем вывод всех ингредиентов на страницу', () => {
    cy.wait('@getUser')
    cy.wait('@getIngredients')

    cy.get('[data-testid="ingredient-card"]').should('have.length', 15)

    cy.get('[data-testid="ingredient-card"]')
      .filter(':has([data-testid="ingredient-name"]:contains("булка"))')
      .should('have.length', 2)

    cy.get('[data-testid="ingredient-name"]:contains("Краторная булка N-200i")').should('exist')
    cy.get('[data-testid="ingredient-name"]:contains("Флюоресцентная булка R2-D3")').should('exist')
  })

  it('открывает и закрывает модальное окно ингредиента', () => {
    cy.wait('@getUser')
    cy.wait('@getIngredients')

    cy.get('[data-testid="ingredient-card"]')
      .first()
      .find('[data-testid="ingredient-name"]')
      .invoke('text')
      .then((ingredientName) => {
        const name = ingredientName.trim()

        cy.get('[data-testid="ingredient-card"]')
          .first()
          .find('[data-testid="ingredient-link"]')
          .click()

        cy.get('[data-testid="modal"]').should('be.visible')

        cy.get('[data-testid="modal"] [data-testid="ingredient-details-name"]')
          .should('have.text', name)

        cy.get('[data-testid="modal-close-button"]').click()

        cy.url().should('eq', Cypress.config().baseUrl + '/')
        cy.get('[data-testid="modal"]').should('not.exist')
      })
  })

  it('добавление булки в конструктор бургера', () => {

    cy.get('[data-testid="bun-top"]').should('not.exist')
    cy.get('[data-testid="bun-bottom"]').should('not.exist')

    cy.get('[data-testid="ingredient-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="ingredient-name"]').should('contain', 'Краторная булка')
      })

    cy.get('[data-testid="ingredient-card"]')
      .first()
      .find('[data-testid="ingredient-add-button"]')
      .click()

    cy.get('[data-testid="bun-top"]')
      .should('be.visible')
      .and('contain', 'Краторная булка N-200i (верх)')

    cy.get('[data-testid="bun-bottom"]')
      .should('be.visible')
      .and('contain', 'Краторная булка N-200i (низ)')

    cy.get('[data-testid="bun-top"]')
      .find('[data-testid="constructor-element-remove-button"]')
      .should('not.exist')

    cy.get('[data-testid="bun-bottom"]')
      .find('[data-testid="constructor-element-remove-button"]')
      .should('not.exist')

    cy.get('[data-testid="ingredient-card"]')
      .first()
      .find('[data-testid="ingredient-add-button"]')
      .click()

    cy.get('[data-testid="bun-top"]').should('have.length', 1)
    cy.get('[data-testid="bun-bottom"]').should('have.length', 1)

    cy.get('[data-testid="ingredient-card"]')
      .eq(2)
      .find('[data-testid="ingredient-add-button"]')
      .click()

    cy.get('[data-testid="constructor-ingredients-list"]')
      .find('[data-testid^="constructor-ingredient-"]')
      .should('have.length', 1)

    cy.get('[data-testid="bun-top"]').should('exist')
    cy.get('[data-testid="bun-bottom"]').should('exist')
  })

  it('удаление ингредиента из конструктора бургера', () => {

    cy.get('[data-testid="bun-top"]').should('not.exist')
    cy.get('[data-testid="bun-bottom"]').should('not.exist')
    cy.get('[data-testid^="constructor-ingredient-"]').should('not.exist')

    cy.get('[data-testid="ingredient-card"]')
      .eq(2)
      .within(() => {
        cy.get('[data-testid="ingredient-name"]').should('not.contain', 'булка')
      })
      .find('[data-testid="ingredient-add-button"]')
      .click()

    cy.get('[data-testid^="constructor-ingredient-"]')
      .should('have.length', 1)

    cy.get('[data-testid^="constructor-ingredient-"]')
      .find('.constructor-element__action')
      .should('be.visible')

    cy.get('[data-testid^="constructor-ingredient-"]')
      .find('.constructor-element__action')
      .click()

    cy.get('[data-testid^="constructor-ingredient-"]').should('not.exist')

    cy.get('[data-testid="ingredient-card"]')
      .first()
      .find('[data-testid="ingredient-add-button"]')
      .click()

    cy.get('[data-testid="ingredient-card"]')
      .eq(2)
      .find('[data-testid="ingredient-add-button"]')
      .click()

    cy.get('[data-testid="bun-top"]').should('exist')
    cy.get('[data-testid="bun-bottom"]').should('exist')
    cy.get('[data-testid^="constructor-ingredient-"]').should('have.length', 1)

    cy.get('[data-testid^="constructor-ingredient-"]')
      .find('.constructor-element__action')
      .click()

    cy.get('[data-testid="bun-top"]').should('exist')
    cy.get('[data-testid="bun-bottom"]').should('exist')
    cy.get('[data-testid^="constructor-ingredient-"]').should('not.exist')
  })

it('оформление заказа: проверка авторизации и модального окна', () => {
  cy.clearLocalStorage()
  cy.visit('/')
  cy.get('[data-testid="ingredient-card"]').first().find('[data-testid="ingredient-add-button"]').click()
  cy.get('[data-testid="order-button"]').click()
  cy.url().should('eq', Cypress.config().baseUrl + '/register')

  cy.visit('/', {
    onBeforeLoad: (win) => {
      win.localStorage.setItem('accessToken', 'mock-access-token')
      win.localStorage.setItem('refreshToken', 'mock-refresh-token')
    }
  })

  cy.wait('@getUser')
  cy.wait('@getIngredients')

  cy.get('[data-testid="ingredient-card"]').first().find('[data-testid="ingredient-add-button"]').click()
  cy.get('[data-testid="ingredient-card"]').eq(2).find('[data-testid="ingredient-add-button"]').click()

  cy.intercept('POST', '/api/orders').as('createOrder')
  cy.get('[data-testid="order-button"]').click()

  cy.wait('@createOrder').then((interception) => {
    const orderNumber = interception.response?.body?.order?.number
    expect(orderNumber).to.be.a('number').and.to.be.greaterThan(0)
    cy.wrap(orderNumber).as('orderNumber')
  })

  cy.get('[data-testid="order-number"]')
    .should('have.length.at.least', 1)
    .each(($el) => {
      const text = $el.text().trim()
      expect(text).to.match(/^\d+$/)
      expect(text).to.have.length.at.least(1)
    })

  cy.get('[data-testid="modal"]')
    .should('have.length.at.least', 1)
    .should('be.visible')

  cy.get('[data-testid="order-done-image"]')
    .should('have.length.at.least', 1)
    .should('be.visible')

  cy.get('[data-testid="order-id-label"]')
    .should('have.length.at.least', 1)
    .each(($el) => {
      const text = $el.text().trim()
      expect(text).to.equal('идентификатор заказа')
    })

    cy.get('[data-testid="modal-close-button"]')
    .should('have.length', 2)
    .then(($buttons) => {
      const secondButton = $buttons[1];
      cy.wrap(secondButton).click({ force: false });
    });

  cy.get('[data-testid="no-bun-top"]').should('exist');
  cy.get('[data-testid="no-bun-bottom"]').should('exist');
  cy.get('[data-testid="no-filling"]').should('exist');

  cy.get('[data-testid="bun-top"]').should('not.exist');
  cy.get('[data-testid="bun-bottom"]').should('not.exist');
  cy.get('[data-testid^="constructor-ingredient-"]').should('not.exist');

  cy.get('[data-testid^="no-bun"]:not([data-testid="no-bun-top"]):not([data-testid="no-bun-bottom"])').should('not.exist');
  cy.get('[data-testid="no-filling"]:not([data-testid="no-filling"])').should('not.exist');

  cy.url().should('eq', Cypress.config().baseUrl + '/');
  })
})
