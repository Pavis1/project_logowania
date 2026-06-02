const { By, until } = require("selenium-webdriver");
const { createDriver } = require("../driver");

jest.setTimeout(30000);

describe("Selenium Dashboard Test", () => {
    let driver;

    beforeAll(async() => {
        driver = await createDriver();
    });

    afterAll(async() => {
        if (driver) await driver.quit();
    });

    test("Powinien pokazywac dashboard poprawnie", async() => {
        await driver.get("http://127.0.0.1:5500/frontend/index.html");

        await driver.wait(until.elementLocated(By.id("totalUsers")), 5000);

        let totalText = await driver.findElement(By.id("totalUsers")).getText();
        let adminsText = await driver.findElement(By.id("totalAdmins")).getText();

        let total = parseInt(totalText);
        let admins = parseInt(adminsText);

        expect(isNaN(total)).toBe(false);
        expect(isNaN(admins)).toBe(false);
    });
});
