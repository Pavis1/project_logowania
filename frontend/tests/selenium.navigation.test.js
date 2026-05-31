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

    test("should correctly navigate between views", async() => {
        await driver.get("http://127.0.0.1:5500/frontend/index.html");

        // // Kliknięcie w link Users
        await driver.findElement(By.linkText("Users")).click();

        // Dynamiczne oczekiwanie, aż element #users otrzyma klasę "active"
        await driver.wait(async() => {
            let cls = await driver.findElement(By.id("users")).getAttribute("class");
            return cls.includes("active");
        }, 5000);

        let usersPage = await driver.findElement(By.id("users")).getAttribute("class");
        expect(usersPage.includes("active")).toBe(true);


        // // Kliknięcie w link Add User
        await driver.findElement(By.linkText("Add User")).click();

        // Dynamiczne oczekiwanie, aż element #add-user otrzyma klasę "active"
        await driver.wait(async() => {
            let cls = await driver.findElement(By.id("add-user")).getAttribute("class");
            return cls.includes("active");
        }, 5000);

        let addPage = await driver.findElement(By.id("add-user")).getAttribute("class");
        expect(addPage.includes("active")).toBe(true);


        // // Kliknięcie w link Dashboard
        await driver.findElement(By.linkText("Dashboard")).click();

        // Dynamiczne oczekiwanie, aż element #dashboard otrzyma klasę "active"
        await driver.wait(async() => {
            let cls = await driver.findElement(By.id("dashboard")).getAttribute("class");
            return cls.includes("active");
        }, 5000);

        let dashPage = await driver.findElement(By.id("dashboard")).getAttribute("class");
        expect(dashPage.includes("active")).toBe(true);
    });
});