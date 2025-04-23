const button = document.querySelectorAll("button");

const req1 = new Request("http://localhost:8000/cities");

//1
button[0].addEventListener("click", function () {
    return fetch(req1)
        .then(response => response.json())
        .then(resource => console.log("Test 1:", resource));
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
        .then(resource => console.log("Test 2:", resource));
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
        .then(resource => console.log("Test 3:", resource))
})

//4
button[3].addEventListener("click", function () {
    fetch(req1)
        .then(response => response.json())
        .then(resource => {
            const noLilleYesMalmo = resource.filter(city => city.id > 2 && city.id <= 43);
            console.log("Test 4:", noLilleYesMalmo);
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
            console.log("Test 5:", resource);
        }
    }
    driverRequestFive();
})

//6
const req3 = new Request("http://localhost:8000/cities/search?text=en");
const url = new URL("http://localhost:8000/cities/search?text=en");
if (url.searchParams.has("text")) {
    console.log(url.searchParams.get("text"));

}

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
            return console.log("Test 6:", resource);
        }
    }
    return driverRequestSix();
})