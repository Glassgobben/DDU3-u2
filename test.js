const req1 = new Request("http://localhost:8000/cities");

//1
fetch(req1)
    .then(response => response.json())
    .then(resource => console.log("Test 1:", resource));

//2
const postMalmo = {
    name: "Malmö",
    country: "Sweden"
};

fetch(req1, {
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

//3
fetch(req1, {
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

//4
fetch(req1)
    .then(response => response.json())
    .then(resource => {
        const noLilleYesMalmo = resource.filter(city => city.id > 2 && city.id <= 43);
        console.log("Test 4:", noLilleYesMalmo);
    })

//5
const req2 = new Request("http://localhost:8000/cities/43");

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
        console.log("Fel i hämtning av resursen", resource);
    } else {
        console.log("Test 5:", resource);
    }
}
driverRequestFive();