const { By, until } = require("selenium-webdriver");
const { createDriver } = require("../driver");

// Opakowujemy w strukturę Jesta z limitem 30 sekund
test("Automatyczne usuwanie użytkownika przez Selenium", async() => {
    const driver = await createDriver();

    try {
        await driver.get("http://127.0.0.1:5500/index.html");

        await driver.wait(
            until.elementLocated(By.css("tbody tr")),
            5000
        );

        let rowsBefore = await driver.findElements(By.css("tbody tr"));
        let countBefore = rowsBefore.length;

        // Zamiast uciszać test logiem, sprawdzamy asercją czy mamy kogo usunąć.
        // Jeśli tabela będzie pusta, test od razu zgłosi błąd, że brakuje danych.
        expect(countBefore).toBeGreaterThan(0);

        let deleteBtn = await driver.findElement(
            By.xpath("//button[contains(text(), 'Delete')]")
        );

        await deleteBtn.click();

        let alert = await driver.switchTo().alert();
        await alert.accept();

        await driver.wait(async() => {
            let rows = await driver.findElements(By.css("tbody tr"));
            return rows.length < countBefore;
        }, 5000);

        let rowsAfter = await driver.findElements(By.css("tbody tr"));
        let countAfter = rowsAfter.length;

        // Używamy asercji Jesta – sprawdzamy czy liczba wierszy PO usunięciu jest mniejsza niż PRZED
        expect(countAfter).toBeLessThan(countBefore);
        console.log("DELETE TEST: OK");

    } catch (e) {
        console.log("ERROR:", e);
        throw e; // Wyrzucamy błąd, aby Jest wiedział, że coś poszło nie tak
    } finally {
        await driver.quit();
    }
}, 30000);