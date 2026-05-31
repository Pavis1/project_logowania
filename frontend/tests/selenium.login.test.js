const { By, until } = require("selenium-webdriver");
const { createDriver } = require("../driver");

jest.setTimeout(30000);

describe("LOGIN TEST", () => {
    let driver;

    beforeAll(async() => {
        driver = await createDriver();
    });

    afterAll(async() => {
        if (driver) await driver.quit();
    });

    test("open page", async() => {
        // Wchodzimy prosto na stronę główną
        await driver.get("http://127.0.0.1:5500/frontend/index.html");
        await driver.wait(until.titleContains("GymFlow"), 5000);
        let title = await driver.getTitle();
        expect(title).toBe("GymFlow Dashboard");
    }, 30000);
});