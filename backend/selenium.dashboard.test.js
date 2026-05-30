const { By, until } = require("selenium-webdriver")
const { createDriver } = require("./driver")

;(async function dashboardTest() {

    const driver = await createDriver()

    try {
        await driver.get("http://127.0.0.1:5500/index.html")

     
        await driver.wait( until.elementLocated(By.id("totalUsers")),5000 )

        let totalText = await driver.findElement(By.id("totalUsers")).getText()
        let adminsText = await driver.findElement(By.id("totalAdmins")).getText()

        let total = parseInt(totalText)
        let admins = parseInt(adminsText)

        console.log("TOTAL USERS:", total)
        console.log("ADMINS:", admins)

        if (!isNaN(total) && !isNaN(admins)) {
            console.log("DASHBOARD TEST: OK")
        } else {
            console.log("DASHBOARD TEST: FAIL")
        }

    } catch (e) {
        console.log("ERROR:", e)
    } finally {
        await driver.quit()
    }

})()