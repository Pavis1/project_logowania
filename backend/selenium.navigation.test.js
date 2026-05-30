const { By } = require("selenium-webdriver")
const { createDriver } = require("./driver")

;(async function navTest() {

    const driver = await createDriver()

    try {
        await driver.get("http://127.0.0.1:5500/index.html")

        await driver.findElement(By.linkText("Users")).click()
        let usersPage = await driver.findElement(By.id("users")).getAttribute("class")

        if (!usersPage.includes("active")) {
            console.log("FAIL")
            return
        }

        await driver.findElement(By.linkText("Add User")).click()
        let addPage = await driver.findElement(By.id("add-user")).getAttribute("class")

        if (!addPage.includes("active")) {
            console.log("FAIL")
            return
        }

        await driver.findElement(By.linkText("Dashboard")).click()
        let dashPage = await driver.findElement(By.id("dashboard")).getAttribute("class")

        if (!dashPage.includes("active")) {
            console.log("FAIL")
            return
        }

        console.log("NAVIGATION TEST: OK")

    } catch (e) {
        console.log("FAIL")
    } finally {
        await driver.quit()
    }

})()