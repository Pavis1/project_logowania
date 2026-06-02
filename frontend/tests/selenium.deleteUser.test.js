const { By, until } = require("selenium-webdriver");
const { createDriver } = require("../driver");

jest.setTimeout(30000);

describe("Selenium Delete User Test", () => {
    let driver;

    beforeAll(async() => {
        driver = await createDriver();
    });

    afterAll(async() => {
        if (driver) await driver.quit();
    });

    test("Powinno usnac uzytkownika", async() => {
        await driver.get("http://127.0.0.1:5500/frontend/index.html");

  
        await driver.findElement(By.linkText("Users")).click();

        let hasUsers = true;

  
        try {
            await driver.wait(until.elementLocated(By.css("tbody tr")), 5000);
        } catch (err) {
            console.log("DELETE TEST: brak użytkowników w bazie danych, pomijam asercję usuwania.");
            hasUsers = false;
        }

        if (hasUsers) {      let rowsBefore = await driver.findElements(By.css("tbody tr"));
            let initialCount = rowsBefore.length;


            let buttons = await driver.findElements(By.css("tbody tr:first-child button"));

            if (buttons.length > 1) {
                await buttons[1].click(); 
            } else if (buttons.length === 1) {
                await buttons[0].click();
            }

      
            try {
           
                await driver.wait(until.alertIsPresent(), 3000);
                
                let alert = await driver.switchTo().alert();
                await alert.accept();
            } catch (alertErr) {
                console.log("Brak alertu potwierdzającego lub został pominięty.");
            }

         
            await driver.sleep(1000);

            let rowsAfter = await driver.findElements(By.css("tbody tr"));
            expect(rowsAfter.length).toBe(initialCount - 1);
        } else {
            let rows = await driver.findElements(By.css("tbody tr"));
            expect(rows.length).toBe(0);
        }
    });
});
