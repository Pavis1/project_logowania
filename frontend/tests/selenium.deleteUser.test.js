const { By, until } = require("selenium-webdriver");
const { createDriver } = require("../driver");

jest.setTimeout(30000);

describe("Selenium Delete User Tests", () => {
    let driver;

    beforeAll(async() => {
        driver = await createDriver();
    });

    afterAll(async() => {
        if (driver) await driver.quit();
    });

    test("should successfully delete a user", async() => {
        await driver.get("http://127.0.0.1:5500/frontend/index.html");

        // Czekamy na załadowanie tabeli
        await driver.wait(until.elementLocated(By.css("tbody tr")), 5000);

        let rowsBefore = await driver.findElements(By.css("tbody tr"));
        let countBefore = rowsBefore.length;

        if (countBefore === 0) {
            console.log("DELETE TEST: brak użytkowników w bazie danych, pomijam asercję.");
            return;
        }

        let deleteBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Delete')]"));
        await driver.executeScript("arguments[0].click();", deleteBtn);

        // Potwierdzenie alertu usunięcia
        await driver.wait(until.alertIsPresent(), 5000);
        let alert = await driver.switchTo().alert();
        await alert.accept();

        // Czekamy aż wiersz zniknie z tabeli
        await driver.wait(async() => {
            let rows = await driver.findElements(By.css("tbody tr"));
            return rows.length < countBefore;
        }, 5000);

        let rowsAfter = await driver.findElements(By.css("tbody tr"));
        expect(rowsAfter.length).toBeLessThan(countBefore);
    });
});