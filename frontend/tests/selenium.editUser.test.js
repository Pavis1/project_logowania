const { By, until } = require("selenium-webdriver");
const { createDriver } = require("../driver");

jest.setTimeout(30000);

describe("Selenium Edit User Tests", () => {
    let driver;

    beforeAll(async() => {
        driver = await createDriver();
    });

    afterAll(async() => {
        if (driver) await driver.quit();
    });

    test("should successfully edit an existing user", async() => {
        await driver.get("http://127.0.0.1:5500/frontend/index.html");

        const usersLink = await driver.wait(until.elementLocated(By.linkText("Users")), 5000);
        await driver.executeScript("arguments[0].click();", usersLink);
        await driver.sleep(1000);

        let rows = await driver.findElements(By.css("tbody tr"));
        if (rows.length === 0) {
            console.log("EDIT TEST: brak użytkowników w bazie danych, pomijam asercję.");
            return;
        }

        let firstRow = rows[0];
        let editBtn = await firstRow.findElement(By.xpath(".//button[contains(text(),'Edit')]"));

        await driver.executeScript("arguments[0].click();", editBtn);
        await driver.sleep(1500);

        let nameInput = await driver.findElement(By.id("name"));
        await driver.wait(until.elementIsVisible(nameInput), 3000);

        await nameInput.clear();
        await nameInput.sendKeys("ZmienionyImie");

        const submitBtn = await driver.findElement(By.css("button[type='submit']"));
        await driver.executeScript("arguments[0].click();", submitBtn);

        // ZABEZPIECZENIE: Jeśli po edycji też wyskakuje alert sukcesu, zamknij go
        try {
            await driver.wait(until.alertIsPresent(), 2000);
            let alert = await driver.switchTo().alert();
            await alert.accept();
        } catch (e) {
            // Jeśli alertu nie ma, po prostu idź dalej
        }

        await driver.sleep(1000);
        const usersLinkBack = await driver.wait(until.elementLocated(By.linkText("Users")), 5000);
        await driver.executeScript("arguments[0].click();", usersLinkBack);
        await driver.sleep(1000);

        let updatedRows = await driver.findElements(By.css("tbody tr"));
        let firstText = await updatedRows[0].getText();
        expect(firstText.includes("ZmienionyImie")).toBe(true);
    });
});