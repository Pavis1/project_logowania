const API = "http://127.0.0.1:8000/api";

let token = localStorage.getItem("token");
let users = [];
let editId = null;

function authFetch(url, options) {



    if (!options) {
        options = {};
    }

    if (!options.headers) {
        options.headers = {};
    }

    options.headers["Content-Type"] = "application/json";

    if (token) {
        options.headers["Authorization"] = "Bearer " + token;
    }

    return fetch(url, options).then(function(res) {

        if (res.status === 401) {
            alert("Brak autoryzacji");
            localStorage.removeItem("token");
            location.reload();
            return;
        }

        if (res.status === 403) {
            alert("Brak dostępu");
            return;
        }

        return res.json();
    });
}

function showPage(id) {

    let pages = document.querySelectorAll(".page");

    for (let i = 0; i < pages.length; i++) {
        pages[i].classList.remove("active");
    }

    document.getElementById(id).classList.add("active");
}

showPage("dashboard");

getUsers();

function login(email, password) {

    fetch(API + "/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(function(res) {
            return res.json().then(function(data) {

                if (!res.ok) {
                    alert("Błąd logowania");
                    return;
                }

                token = data.access_token;
                localStorage.setItem("token", token);

                alert("Zalogowano");

                getUsers();
            });
        });
}

function getUsers() {

    authFetch(API + "/users")
        .then(function(data) {

            if (!data) return;

            users = data;

            let tbody = document.querySelector("tbody");
            tbody.innerHTML = "";

            for (let i = 0; i < users.length; i++) {

                tbody.innerHTML +=
                    "<tr>" +
                    "<td>" + users[i].name + " " + users[i].surname + "</td>" +
                    "<td>" + users[i].email + "</td>" +
                    "<td>" + users[i].role + "</td>" +
                    "<td>" +
                    "<button onclick='editUser(" + users[i].id + ")'>Edit</button>" +
                    "<button onclick='deleteUser(" + users[i].id + ")'>Delete</button>" +
                    "</td>" +
                    "</tr>";
            }

            document.getElementById("totalUsers").innerText = users.length;

            let adminCount = 0;

            for (let i = 0; i < users.length; i++) {
                if (users[i].role === "admin") {
                    adminCount++;
                }
            }

            document.getElementById("totalAdmins").innerText = adminCount;
            document.getElementById("activeUsers").innerText = users.length;
        });
}

document.getElementById("userForm").addEventListener("submit", function(e) {

    e.preventDefault();

    let user = {
        name: document.getElementById("name").value,
        surname: document.getElementById("surname").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        role: document.getElementById("role").value
    };

    if (editId !== null) {

        authFetch(API + "/users/" + editId, {
            method: "PUT",
            body: JSON.stringify(user)
        }).then(function() {
            alert("Zaktualizowano");
            editId = null;
            getUsers();
        });

    } else {

        authFetch(API + "/users", {
            method: "POST",
            body: JSON.stringify(user)
        }).then(function() {
            alert("Dodano użytkownika");
            getUsers();
        });
    }

    e.target.reset();
    showPage("users");
});

function deleteUser(id) {

    let ok = confirm("Usunąć użytkownika?");

    if (!ok) return;

    authFetch(API + "/users/" + id, {
        method: "DELETE"
    }).then(function() {
        getUsers();
    });
}

function editUser(id) {

    let user = null;

    for (let i = 0; i < users.length; i++) {
        if (users[i].id === id) {
            user = users[i];
        }
    }

    if (!user) return;

    editId = id;

    document.getElementById("name").value = user.name;
    document.getElementById("surname").value = user.surname;
    document.getElementById("email").value = user.email;
    document.getElementById("password").value = "";
    document.getElementById("role").value = user.role;

    showPage("add-user");
}

function logout() {
    localStorage.removeItem("token");
    token = null;
    alert("Wylogowano");
    location.reload();
}