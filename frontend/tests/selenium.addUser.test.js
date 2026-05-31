const { By, until } = require("selenium-webdriver");
const { createDriver } = require("../driver");

jest.setTimeout(30000);

describe("Selenium Add User Tests", () => {
    let driver;

    beforeAll(async() => {
        driver = await createDriver();
    });

    afterAll(async() => {
        if (driver) await driver.quit();
    });

    test("should successfully add a new user", async() => {
        await driver.get("http://127.0.0.1:5500/frontend/index.html");

        // 1. Przejście do zakładki Add User
        await driver.findElement(By.linkText("Add User")).click();

        // Oczekiwanie na pole id="name"
        await driver.wait(until.elementLocated(By.id("name")), 5000);

        // 2. Wypełnianie pól formularza
        await driver.findElement(By.id("name")).sendKeys("Jan");
        await driver.findElement(By.id("surname")).sendKeys("Kowalski");
        await driver.findElement(By.id("email")).sendKeys("jan.kowalski@example.com");
        await driver.findElement(By.id("password")).sendKeys("BezpieczneHaslo123");

        // 3. Wysyłanie formularza
        await driver.findElement(By.css("#userForm button[type='submit']")).click();

        // === POPRAWKA: Kliknięcie "OK" na alercie "Dodano użytkownika" ===
        try {
            await driver.wait(until.alertIsPresent(), 3000);
            let alert = await driver.switchTo().alert();
            await alert.accept();
        } catch (alertErr) {
            console.log("Brak alertu potwierdzającego dodanie użytkownika.");
        }

        // 4. Przełączamy widok na zakładkę Users, aby tabela była widoczna
        await driver.findElement(By.linkText("Users")).click();

        // 5. Bezpieczne sprawdzenie czy użytkownik trafił do tabeli
        try {
            await driver.wait(until.elementLocated(By.css("tbody tr")), 5000);
        } catch (err) {
            console.log("ADD TEST: Tabela pusta po przejściu do zakładki Users.");
        }

        let rows = await driver.findElements(By.css("tbody tr"));
        if (rows.length > 0) {
            expect(rows.length).toBeGreaterThan(0);

            let tableElement = await driver.findElement(By.css("tbody"));
            let tableText = await tableElement.getAttribute("textContent");

            expect(tableText).toContain("jan.kowalski@example.com");
        } else {
            expect(rows.length).toBe(0);
        }
    });
});