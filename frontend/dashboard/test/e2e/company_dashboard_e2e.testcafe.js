import { Selector } from 'testcafe';

TestDb.setupExampleData1();

fixture `Company Dashboard E2E`
    .page `http://localhost:8181`;

test('Login and register', async t => {
    await t
        .click(Selector('button').withText('LOGIN'))
        .typeText(Selector('.auth0-lock-widget').find('[name="email"]'), 'luke34@gmx.de', {
            caretPos: 0
        })
        .typeText(Selector('.auth0-lock-widget').find('[name="password"]'), 'TestAuth1337!!!')
        .click(Selector('.auth0-lock-submit'))
        .click(Selector('button').withText('REGISTER'))
        .typeText(Selector('input[name="title"]'), 'TestRestaurant1')
        .typeText(Selector('input[name="address"]'), 'Hinterholz 16')
        .typeText(Selector('input[name="zipCode"]'), '85250')
        .typeText(Selector('input[name="email"]'), 'asd@asd.asd')
        .typeText(Selector('input[name="telephone"]'), '0123456789')
        .typeText(Selector('input[name="website"]'), 'www.asd.asd')
        .click(Selector('button'))
        .expect(Selector('svg')).ok('Should show Ok Icon')
        .expect(Selector('aside').innerText).contains('Your registration was successful', 'Should show success message')
        .navigateTo('/')
        .click(Selector('span').withText('Not approved'));
});

test('Login new company', async t => {
    await t
        .click(Selector('button').withText('LOGIN'))
        .typeText(Selector('.auth0-lock-widget').find('[name="email"]'), 'luke34@gmx.de')
        .typeText(Selector('.auth0-lock-widget').find('[name="password"]'), 'TestAuth1337!!!')
        .click(Selector('.auth0-lock-submit'))
        .drag(Selector('p').withText('Please fill in the base data for your restaurant f'), 323, 1, {
            offsetX: 38,
            offsetY: 16
        })
        .expect(ClientFunction(() => document.location.href)()).contains("/restaurant", 'Should redirect to restaurant details');
});