const { By, until } = require("selenium-webdriver")
const { createDriver } = require("./driver")

;(async function deleteUserTest() {

    const driver = await createDriver()

    try {
        await driver.get("http://127.0.0.1:5500/index.html")

        await driver.wait(
            until.elementLocated(By.css("tbody tr")),
            5000
        )

        let rowsBefore = await driver.findElements(By.css("tbody tr"))
        let countBefore = rowsBefore.length

        if (countBefore === 0) {
            console.log("DELETE TEST: brak userów do testu")
            return
        }

     
        let deleteBtn = await driver.findElement(
            By.xpath("//button[contains(text(),'Delete')]")
        )

        await deleteBtn.click()

        let alert = await driver.switchTo().alert()
        await alert.accept()

    
        await driver.wait(async () => {
            let rows = await driver.findElements(By.css("tbody tr"))
            return rows.length < countBefore
        }, 5000)

        let rowsAfter = await driver.findElements(By.css("tbody tr"))
        let countAfter = rowsAfter.length

        if (countAfter < countBefore) {
            console.log("DELETE TEST: OK")
        } else {
            console.log("DELETE TEST: FAIL")
        }

    } catch (e) {
        console.log("ERROR:", e)
    } finally {
        await driver.quit()
    }

})()