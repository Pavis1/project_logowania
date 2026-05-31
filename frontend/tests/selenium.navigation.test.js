const { By, until } = require("selenium-webdriver");
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

        // Kliknięcie w link Users
        await driver.findElement(By.linkText("Users")).click();
        await driver.sleep(500); // <-- NOWOŚĆ: czas dla JS na zmianę widoku
        let usersPage = await driver.findElement(By.id("users")).getAttribute("class");
        expect(usersPage.includes("active")).toBe(true);

        // Kliknięcie w link Add User
        await driver.findElement(By.linkText("Add User")).click();
        await driver.sleep(500); // <-- NOWOŚĆ
        let addPage = await driver.findElement(By.id("add-user")).getAttribute("class");
        expect(addPage.includes("active")).toBe(true);

        // Kliknięcie w link Dashboard
        await driver.findElement(By.linkText("Dashboard")).click();
        await driver.sleep(500); // <-- NOWOŚĆ
        let dashPage = await driver.findElement(By.id("dashboard")).getAttribute("class");
        expect(dashPage.includes("active")).toBe(true);
    });
});