const req1 = new Request("http://localhost:8000/cities");

fetch(req1)
    .then(response => response.json())
    .then(resource => console.log(resource));

const newCity = {
    name: "Malmö",
    country: "Sweden"
};

fetch(req1, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCity)
})
    .then(response => {
        if (!response.ok) {
            throw new Error("Något gick fel vid POST");
        }
        return response.json();
    })
    .then(resource => console.log(resource));