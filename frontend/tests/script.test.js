const { JSDOM } = require("jsdom");

describe("UI Navigation", () => {

    let document;

    beforeEach(() => {
        const dom = new JSDOM(`
            <html>
                <body>
                    <div id="dashboard" class="page active"></div>
                    <div id="users" class="page"></div>
                    <div id="add-user" class="page"></div>
                </body>
            </html>
        `);

        document = dom.window.document;
        global.document = document;
    });

    afterEach(() => {
        global.document = undefined;
    });

    function showPage(id) {
        let pages = document.querySelectorAll(".page");

        pages.forEach(page => page.classList.remove("active"));
        document.getElementById(id).classList.add("active");
    }

    test("should switch page correctly", () => {
        showPage("users");

        expect(document.getElementById("users").classList.contains("active")).toBe(true);
        expect(document.getElementById("dashboard").classList.contains("active")).toBe(false);
    });
});


// ==================== DASHBOARD ====================

describe("Dashboard logic", () => {

    test("should count admins correctly", () => {

        let users = [
            { role: "admin" },
            { role: "user" },
            { role: "admin" }
        ];

        let admins = users.filter(u => u.role === "admin");

        expect(admins.length).toBe(2);
    });
});


// ==================== FORM ====================

describe("Form logic", () => {

    test("should create user object correctly", () => {

        function buildUser() {
            return {
                name: "Jan",
                surname: "Kowalski",
                email: "test@test.com",
                password: "1234",
                role: "user"
            };
        }

        let user = buildUser();

        expect(user.email).toBe("test@test.com");
        expect(user.role).toBe("user");
    });
});


// ==================== AUTH FETCH ====================

describe("authFetch", () => {

    beforeEach(() => {
        global.fetch = jest.fn();
    });

    test("should attach token to request", async() => {

        global.fetch.mockResolvedValue({
            status: 200,
            json: async() => ({ ok: true })
        });

        let token = "abc123";

        async function authFetch(url, options = {}) {
            options.headers = {
                ...options.headers,
                Authorization: "Bearer " + token
            };

            return fetch(url, options);
        }

        await authFetch("http://test.com");

        expect(fetch).toHaveBeenCalled();

        expect(fetch.mock.calls[0][1].headers.Authorization)
            .toBe("Bearer abc123");
    });
});