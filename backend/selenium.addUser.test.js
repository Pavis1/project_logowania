const { By, until } = require("selenium-webdriver")
const { createDriver } = require("./driver")

;(async function addUserTest() {

    const driver = await createDriver()

    try {
        await driver.get("http://127.0.0.1:5500/index.html")

        await driver.findElement(By.linkText("Add User")).click()

        await driver.findElement(By.id("name")).sendKeys("Jan")
        await driver.findElement(By.id("surname")).sendKeys("Kowalski")
        await driver.findElement(By.id("email")).sendKeys("jan@test.com")
        await driver.findElement(By.id("password")).sendKeys("1234")

    
        let role = await driver.findElement(By.id("role"))
        await role.sendKeys("user")

        await driver.findElement(By.css("button[type='submit']")).click()

   
        await driver.wait( until.elementLocated(By.css("tbody tr")),5000)

        let rows = await driver.findElements(By.css("tbody tr"))

        if (rows.length > 0) {
            console.log("ADD USER TEST: OK")
        } else {
            console.log("ADD USER TEST: FAIL")
        }

    } catch (e) {
        console.log("ERROR:", e)
    } finally {
        await driver.quit()
    }

})()