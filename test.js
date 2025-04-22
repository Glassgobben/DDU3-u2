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
            throw new Error(`Kunde inte posta Malmö`);
        }
        return response.json();
    })
    .then(resource => console.log("Test 2:", resource));

//3
fetch(req1, { method: "DELETE" })