const { By } = require("selenium-webdriver");
const { createDriver } = require("../driver");

// Opakowujemy w strukturę Jesta z limitem 30 sekund
test("Automatyczna nawigacja po menu przez Selenium", async() => {
    const driver = await createDriver();

    try {
        await driver.get("http://127.0.0.1:5500/index.html");

        // Kliknięcie w menu "Users" i sprawdzenie czy klasa zawiera "active"
        await driver.findElement(By.linkText("Users")).click();
        let usersPage = await driver.findElement(By.id("users")).getAttribute("class");
        expect(usersPage).toContain("active");

        // Kliknięcie w menu "Add User" i sprawdzenie czy klasa zawiera "active"
        await driver.findElement(By.linkText("Add User")).click();
        let addPage = await driver.findElement(By.id("add-user")).getAttribute("class");
        expect(addPage).toContain("active");

        // Kliknięcie w menu "Dashboard" i sprawdzenie czy klasa zawiera "active"
        await driver.findElement(By.linkText("Dashboard")).click();
        let dashPage = await driver.findElement(By.id("dashboard")).getAttribute("class");
        expect(dashPage).toContain("active");

        console.log("NAVIGATION TEST: OK");

    } catch (e) {
        console.log("ERROR:", e);
        throw e; // Wyrzucamy błąd, aby Jest poprawnie oznaczył test jako oblany
    } finally {
        await driver.quit();
    }
}, 30000);