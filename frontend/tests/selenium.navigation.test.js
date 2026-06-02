const { By } = require("selenium-webdriver");
const { createDriver } = require("../driver");

jest.setTimeout(30000);

describe("Selenium Navigation Tests", () => {
    let driver;

    beforeAll(async() => {
        driver = await createDriver();
    });

    afterAll(async() => {
        if (driver) await driver.quit();
    });

    test("Powinno poprawnie nawigowac miedzy stronami", async() => {
        await driver.get("http://127.0.0.1:5500/frontend/index.html");


        await driver.findElement(By.linkText("Users")).click();


        await driver.wait(async() => {
            let cls = await driver.findElement(By.id("users")).getAttribute("class");
            return cls.includes("active");
        }, 5000);

        let usersPage = await driver.findElement(By.id("users")).getAttribute("class");
        expect(usersPage.includes("active")).toBe(true);

        await driver.findElement(By.linkText("Add User")).click();


        await driver.wait(async() => {
            let cls = await driver.findElement(By.id("add-user")).getAttribute("class");
            return cls.includes("active");
        }, 5000);

        let addPage = await driver.findElement(By.id("add-user")).getAttribute("class");
        expect(addPage.includes("active")).toBe(true);



        await driver.findElement(By.linkText("Dashboard")).click();


        await driver.wait(async() => {
            let cls = await driver.findElement(By.id("dashboard")).getAttribute("class");
            return cls.includes("active");
        }, 5000);

        let dashPage = await driver.findElement(By.id("dashboard")).getAttribute("class");
        expect(dashPage.includes("active")).toBe(true);
    });
});
