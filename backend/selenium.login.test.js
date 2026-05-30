const { Builder, until } = require("selenium-webdriver")

describe("LOGIN TEST", () => {

    let driver

    beforeAll(async () => {
        driver = await new Builder().forBrowser("chrome").build()
    })

    afterAll(async () => {
        if (driver) {
            await driver.quit()
        }
    })

    test("open page", async () => {

        await driver.get("http://127.0.0.1:5500/index.html")

        await driver.wait(until.titleContains("GymFlow"), 5000)

        let title = await driver.getTitle()

        expect(title).toBe("GymFlow Dashboard")
    }, 20000)

})