const { By, until } = require("selenium-webdriver");
const { createDriver } = require("../driver");

// Opakowujemy w strukturę Jesta z limitem 30 sekund
test("Automatyczne sprawdzanie panelu dashboard przez Selenium", async() => {
    const driver = await createDriver();

    try {
        await driver.get("http://127.0.0.1:5500/index.html");

        await driver.wait(until.elementLocated(By.id("totalUsers")), 5000);

        let totalText = await driver.findElement(By.id("totalUsers")).getText();
        let adminsText = await driver.findElement(By.id("totalAdmins")).getText();

        let total = parseInt(totalText);
        let admins = parseInt(adminsText);

        console.log("TOTAL USERS:", total);
        console.log("ADMINS:", admins);

        // Zamiast zwykłego 'if', używamy asercji Jesta. 
        // Sprawdzamy, czy pobrane wartości są poprawne i czy system poprawnie je przekonwertował na liczby.
        expect(total).not.toBeNaN();
        expect(admins).not.toBeNaN();
        console.log("DASHBOARD TEST: OK");

    } catch (e) {
        console.log("ERROR:", e);
        throw e; // Wyrzucamy błąd, aby Jest wiedział, że test oblał
    } finally {
        await driver.quit();
    }
}, 30000);