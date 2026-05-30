const { By } = require("selenium-webdriver");
const { createDriver } = require("../driver");

// Opakowujemy w strukturę Jesta z limitem 30 sekund
test("Automatyczna edycja użytkownika przez Selenium", async() => {
    const driver = await createDriver();

    try {
        await driver.get("http://127.0.0.1:5500/index.html");

        await driver.sleep(2000);

        let rows = await driver.findElements(By.css("tbody tr"));

        // Zamiast uciszać test logiem, sprawdzamy asercją czy mamy kogo edytować.
        // Jeśli tabela będzie pusta, test zgłosi błąd informujący o braku danych.
        expect(rows.length).toBeGreaterThan(0);

        let firstRow = rows[0];
        let editBtn = await firstRow.findElement(By.xpath(".//button[contains(text(), 'Edit')]"));
        await editBtn.click();

        await driver.sleep(1000);

        let nameInput = await driver.findElement(By.id("name"));
        await nameInput.clear();
        await nameInput.sendKeys("Zmieniony");

        await driver.findElement(By.css("button[type='submit']")).click();

        await driver.sleep(2000);

        let updatedRows = await driver.findElements(By.css("tbody tr"));
        let firstText = await updatedRows[0].getText();

        // Używamy asercji Jesta – sprawdzamy czy tekst pierwszego wiersza zawiera słowo "Zmieniony"
        expect(firstText).toContain("Zmieniony");
        console.log("EDIT TEST: OK");

    } catch (e) {
        console.log("ERROR:", e);
        throw e; // Wyrzucamy błąd, aby Jest poprawnie oznaczył test jako oblany
    } finally {
        await driver.quit();
    }
}, 30000);