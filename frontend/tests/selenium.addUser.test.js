const { By, until } = require("selenium-webdriver");
const { createDriver } = require("../driver");

// Opakowujemy skrypt w oficjalną funkcję testową Jesta
// Dodajemy limit 30000 ms (30 sekund), ponieważ Selenium potrzebuje czasu na uruchomienie przeglądarki
test("Automatyczne dodawanie użytkownika przez Selenium", async() => {
    const driver = await createDriver();

    try {
        await driver.get("http://127.0.0.1:5500/index.html");

        await driver.findElement(By.linkText("Add User")).click();

        await driver.findElement(By.id("name")).sendKeys("Jan");
        await driver.findElement(By.id("surname")).sendKeys("Kowalski");
        await driver.findElement(By.id("email")).sendKeys("jan@test.com");
        await driver.findElement(By.id("password")).sendKeys("1234");

        let role = await driver.findElement(By.id("role"));
        await role.sendKeys("user");

        await driver.findElement(By.css("button[type='submit']")).click();

        await driver.wait(until.elementLocated(By.css("tbody tr")), 5000);

        let rows = await driver.findElements(By.css("tbody tr"));

        // Zamiast zwykłego console.log, używamy asercji Jesta.
        // Dzięki temu Jest oficjalnie oznaczy test jako "PASS" lub "FAIL" w raporcie.
        expect(rows.length).toBeGreaterThan(0);
        console.log("ADD USER TEST: OK");

    } catch (e) {
        console.log("ERROR:", e);
        throw e; // Wyrzucamy błąd dalej, aby Jest wiedział, że test się nie powiódł
    } finally {
        await driver.quit();
    }
}, 30000);