describe('Workflow utilisateur complet', () => {
  const adminEmail = `admin${Date.now()}@test.com`;
  const userEmail = `user${Date.now()}@test.com`;

  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  // it.skip('crée un admin, un user, affiche la liste, voit les détails puis le supprime', () => {
  //   cy.fillUserForm({
  //     firstname: 'Admin',
  //     lastname: 'Test',
  //     email: adminEmail,
  //     birthdate: '1980-01-01',
  //     city: 'Nice',
  //     zipcode: '06000',
  //     password: 'adminpass',
  //     isAdmin: true
  //   });

  //   cy.fillUserForm({
  //     firstname: 'User',
  //     lastname: 'Simple',
  //     email: userEmail,
  //     birthdate: '1995-05-05',
  //     city: 'Lyon',
  //     zipcode: '69000',
  //     password: 'userpass',
  //     isAdmin: false
  //   });

  //   cy.get('ul').should('exist');
  //   cy.get('ul li').contains(userEmail).should('exist');

  //   cy.get('input[placeholder="Ton email admin"]').clear().type(adminEmail);
  //   cy.get('ul li').contains(userEmail).closest('li').within(() => {
  //     cy.contains('Voir').click();
  //   });
  //   cy.contains('Détails de l’utilisateur');
  //   cy.get('pre').should('exist');

  //   cy.get('input[placeholder="Ton email admin"]').clear().type(adminEmail);
  //   cy.get('ul li').contains(userEmail).closest('li').within(() => {
  //     cy.contains('Supprimer').click();
  //   });
  //   cy.on('window:alert', txt => {
  //     expect(txt).to.contain('Utilisateur');
  //     expect(txt).to.contain('supprimé');
  //   });
  // });

  // it('empêche la soumission si le prénom est manquant', () => {
  //   cy.get('input[name="lastname"]').type('Test');
  //   cy.get('button[type="submit"]').click();

  //   cy.on('window:alert', () => {
  //     throw new Error('Le formulaire ne doit pas se soumettre sans prénom');
  //   });
  // });

  it('empêche la création avec un email déjà utilisé', () => {
    const email = `dup${Date.now()}@test.com`;

    cy.fillUserForm({
      firstname: 'Dup1',
      lastname: 'User',
      email,
      birthdate: '1990-01-01',
      city: 'Paris',
      zipcode: '75000',
      password: 'secret123',
      isAdmin: false
    });

    cy.get('input[name="firstname"]').clear().type('Dup2');
    cy.get('input[name="email"]').clear().type(email);
    cy.get('button[type="submit"]').click();

    cy.on('window:alert', (txt) => {
      expect(txt).to.contain('déjà utilisé');
    });
  });

  it('refuse la suppression si l’email admin est invalide', () => {
    cy.get('input[placeholder="Ton email admin"]').clear().type('invalid@admin.com');
    cy.get('ul li').first().within(() => {
      cy.contains('Supprimer').click();
    });
    cy.on('window:alert', (txt) => {
      expect(txt).to.contain('Suppression refusée');
    });
  });
});

Cypress.Commands.add('fillUserForm', ({
  firstname, lastname, email, birthdate,
  city, zipcode, password, isAdmin = false
}) => {
  cy.get('input[name="firstname"]').clear().type(firstname);
  cy.get('input[name="lastname"]').clear().type(lastname);
  cy.get('input[name="email"]').clear().type(email);
  cy.get('input[name="birthdate"]').clear().type(birthdate);
  cy.get('input[name="city"]').clear().type(city);
  cy.get('input[name="zipcode"]').clear().type(zipcode);
  cy.get('input[name="password"]').clear().type(password);
  cy.get('input[name="is_admin"]')[isAdmin ? 'check' : 'uncheck']();
  cy.get('button[type="submit"]').click();
  cy.on('window:alert', (txt) => {
    expect(txt).to.equal('Utilisateur ajouté !');
  });
});
