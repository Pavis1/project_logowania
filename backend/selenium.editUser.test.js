const { By } = require("selenium-webdriver");
const { createDriver } = require("./driver");

(async function editUserTest() {

    const driver = await createDriver();

    try {
        await driver.get("http://127.0.0.1:5500/index.html");

        await driver.sleep(2000);

 
        let rows = await driver.findElements(By.css("tbody tr"));

        if (rows.length === 0) {
            console.log("EDIT TEST: brak userów");
            return;
        }


        let firstRow = rows[0];
        let editBtn = await firstRow.findElement(By.xpath(".//button[contains(text(),'Edit')]"));
        await editBtn.click();

        await driver.sleep(1000);

    
        let nameInput = await driver.findElement(By.id("name"));
        await nameInput.clear();
        await nameInput.sendKeys("Zmieniony");

        await driver.findElement(By.css("button[type='submit']")).click();

        await driver.sleep(2000);

       
        let updatedRows = await driver.findElements(By.css("tbody tr"));
        let firstText = await updatedRows[0].getText();

        if (firstText.includes("Zmieniony")) {
            console.log("EDIT TEST: OK");
        } else {
            console.log("EDIT TEST: FAIL");
        }

    } catch (e) {
        console.log("ERROR:", e);
    } finally {
        await driver.quit();
    }

})();