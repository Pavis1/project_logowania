const { JSDOM } = require("jsdom")

describe("UI tests", () => {

    let document

    beforeEach(() => {

        const dom = new JSDOM(`
            <html>
                <body>
                    <div id="dashboard" class="page active"></div>
                    <div id="users" class="page"></div>
                    <div id="add-user" class="page"></div>

                    <p id="totalUsers">0</p>
                    <p id="totalAdmins">0</p>
                    <p id="activeUsers">0</p>
                </body>
            </html>
        `)

        document = dom.window.document
        global.document = document
    })


    function showPage(id) {
        let pages = document.querySelectorAll(".page")

        pages.forEach(p => p.classList.remove("active"))

        document.getElementById(id).classList.add("active")
    }


    test("switch page", () => {

        showPage("users")

        expect(document.getElementById("users").classList.contains("active")).toBe(true)
        expect(document.getElementById("dashboard").classList.contains("active")).toBe(false)
    })


    test("dashboard counters", () => {

        let users = [
            { role: "admin" },
            { role: "user" },
            { role: "admin" }
        ]

        document.getElementById("totalUsers").innerText = users.length

        let admins = users.filter(u => u.role === "admin")
        document.getElementById("totalAdmins").innerText = admins.length

        expect(document.getElementById("totalUsers").innerText).toBe("3")
        expect(document.getElementById("totalAdmins").innerText).toBe("2")
    })

})