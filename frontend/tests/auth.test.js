describe("AUTH logic", () => {

    beforeEach(() => {
        global.fetch = jest.fn()

        global.localStorage = {
            store: {},
            getItem(key) {
                return this.store[key] || null
            },
            setItem(key, value) {
                this.store[key] = value
            },
            removeItem(key) {
                delete this.store[key]
            }
        }
    })

    test("should attach token to request headers", async() => {

        let token = "abc123"

        async function authFetch(url, options = {}) {

            let headers = options.headers || {}

            headers["Authorization"] = "Bearer " + token

            return fetch(url, {
                ...options,
                headers
            })
        }

        global.fetch.mockResolvedValue({
            status: 200,
            json: async() => ({ ok: true })
        })

        await authFetch("http://test.com")

        let call = fetch.mock.calls[0][1]

        expect(call.headers.Authorization).toBe("Bearer abc123")
    })


    test("should store token after login", () => {

        localStorage.setItem("token", "jwt-token-123")

        expect(localStorage.getItem("token")).toBe("jwt-token-123")
    })


    test("should remove token on logout", () => {

        localStorage.setItem("token", "abc")
        localStorage.removeItem("token")

        expect(localStorage.getItem("token")).toBeNull()
    })

})