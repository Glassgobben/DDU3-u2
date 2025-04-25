const button = document.querySelectorAll("button");
const message = document.getElementById("message");

const req1 = new Request("http://localhost:8000/cities");

//1
button[0].addEventListener("click", function () {
    return fetch(req1)
        .then(response => response.json())
        .then(resource => message.textContent = JSON.stringify(resource));
})

//2
button[1].addEventListener("click", function () {
    const postMalmo = {
        name: "Malmö",
        country: "Sweden"
    };
    return fetch(req1, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postMalmo)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Kunde inte posta ${postMalmo}`);
            }
            return response.json();
        })
        .then(resource => message.textContent = JSON.stringify(resource));
})

//3
button[2].addEventListener("click", function () {
    return fetch(req1, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: 2 })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Kunde inte deleta staden med id: 2")
            }
            return response.json();
        })
        .then(resource => message.textContent = JSON.stringify(resource))
})

//4
button[3].addEventListener("click", function () {
    fetch(req1)
        .then(response => response.json())
        .then(resource => {
            const noLilleYesMalmo = resource.filter(city => city.id > 2 && city.id <= 43);
            message.textContent = JSON.stringify(resource);
        })
})

//5
const req2 = new Request("http://localhost:8000/cities/43");

button[4].addEventListener("click", function () {
    async function requestFive() {
        try {
            const response = await fetch(req2);
            return await response.json();
        } catch (error) {
            console.log("Network error");
        }
    }

    async function driverRequestFive() {
        const resource = await requestFive();
        if (resource == false) {
            console.log("5: Fel i hämtning av resursen", resource);
        } else {
            message.textContent = JSON.stringify(resource);
        }
    }
    driverRequestFive();
})

//6
const req3 = new Request("http://localhost:8000/cities/search?text=en");

button[5].addEventListener("click", function () {
    async function requestSix() {
        try {
            const response = await fetch(req3);
            return await response.text();
        } catch (error) {
            console.error("6:", error);
        }
    }

    async function driverRequestSix() {
        const resource = await requestSix();
        if (resource == false) {
            return console.error("6: Fel i hämtning av resursen", resource);
        } else {
            message.textContent = resource;
        }
    }
    return driverRequestSix();
})

//7
const req4 = new Request("http://localhost:8000/cities/search?text=en&country=Sweden");

button[6].addEventListener("click", function () {
    async function requestSeven() {
        try {
            const response = await fetch(req4);
            return await response.text();
        } catch (error) {
            console.error("7", error);
        }
    }

    async function driverRequestSeven() {
        const resource = await requestSeven();
        if (resource == false) {
            console.error("7: Fel i hämtning av resursen", resource);
        } else {
            message.textContent = resource;
        }
    }
    return driverRequestSeven();
})

//8
button[7].addEventListener("click", function () {
    const body = { name: "Dresden", country: "Germany" };
    fetch(req1, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
        .then(response => response.json())
        .then(resource => message.textContent = resource);
})

//9
button[8].addEventListener("click", function () {
    const body = { name: "Ystad" };
    fetch(req1, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
        .then(response => response.json())
        .then(resource => message.textContent = JSON.stringify(resource));
})

//10
button[9].addEventListener("click", function () {
    async function requestTen() {
        const body = { id: 56 };
        try {
            const response = await fetch(req1, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })
            return await response.json();
        } catch (error) {
            return console.error("10", error);
        }
    }

    async function driverRequestTen() {
        const resource = await requestTen();
        if (resource == false) {
            console.error("10: Fel vid hämtning av resurs", resource);
        } else {
            message.textContent = JSON.stringify(resource);
        }
    }
    return driverRequestTen();
})

//11
button[10].addEventListener("click", function () {
    const body = {};
    fetch(req1, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
        .then(response => response.json())
        .then(resource => message.textContent = JSON.stringify(resource));
})

//12
const req5 = new Request("http://localhost:8000/messages")

button[11].addEventListener("click", function () {
    const body = {
        from: 2,
        to: 1,
        password: "pass"
    };

    async function requestTwelve() {
        try {
            const response = await fetch(req5, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            return await response.json();
        } catch (error) {
            return console.error("12", error);
        }
    }

    async function driverRequestTwelve() {
        const resource = await requestTwelve();
        if (resource == false) {
            console.error("12: Fel vid hämtning av resurs", resource);
        } else {
            return message.textContent = JSON.stringify(resource);
        }
    }
    return driverRequestTwelve();
})

const req6 = new Request("http://localhost:8000/cities/search");

//13
button[12].addEventListener("click", function () {
    async function requestThirteen() {
        try {
            const response = await fetch(req6);
            return await response.json();
        } catch (error) {
            return console.error("13", error);
        }
    }

    async function driverRequestThirteen() {
        const resource = await requestThirteen();
        if (resource == false) {
            console.error("13: Fel vid hämtning av resurs", resource);
        } else {
            return message.textContent = JSON.stringify(resource);
        }
    }
    return driverRequestThirteen();
})