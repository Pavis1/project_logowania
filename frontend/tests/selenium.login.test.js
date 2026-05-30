const { until } = require("selenium-webdriver");
const { createDriver } = require("../driver");
jest.setTimeout(30000); // Daj Jestowi aż 30 sekund na uruchomienie przeglądarki

describe("LOGIN TEST", () => {
    let driver;

    // Używamy wspólnej funkcji createDriver, aby zachować pełną spójność z resztą testów
    beforeAll(async() => {
        driver = await createDriver();
    });

    afterAll(async() => {
        if (driver) {
            await driver.quit();
        }
    });

    test("open page", async() => {
        await driver.get("http://127.0.0.1:5500/index.html");

        await driver.wait(until.titleContains("GymFlow"), 5000);

        let title = await driver.getTitle();

        // Asercja Jesta sprawdzająca tytuł strony
        expect(title).toBe("GymFlow Dashboard");
    }, 30000); // Bezpieczny limit zwiększony do 30 sekund
});