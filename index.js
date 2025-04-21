const rightContainer = document.getElementById("right");
const cities = document.getElementById("cities");
const addName = document.getElementById("add_name");
const addCountry = document.getElementById("add_country");
const addButton = document.getElementById("add_button");
const searchName = document.getElementById("search_name");
const searchCountry = document.getElementById("search_country");
const searchButton = document.getElementById("search_button");
const citySuggestions = document.getElementById("city_suggestions_hidden");

const req = new Request("http://localhost:8000/cities");

fetch(req)
    .then(response => response.json())
    .then(resource => {
        resource.forEach(city => {
            let div1 = document.createElement("div");
            div1.classList.add("city");
            const name = city.name;
            const country = city.country;
            div1.textContent = `${name}, ${country}`;

            let div2 = document.createElement("div");
            div2.classList.add("delete_button");
            div2.textContent = "delete";
            /* div2.addEventListener("click", async function () {
                 fetch(req, { method: "DELETE" })
                     .then(response => {
                         response.json();
                     })
                     .then(resource => {
                         const target = resource.filter(city => city.name == name && city.country == country);
                         return target
                     })
                     .catch(error => {
                         console.error("Fel:", error);
                     });
             }) */

            cities.append(div1);
            div1.append(div2);
        })
    })

addButton.addEventListener("click", function () {
    const newCity = {
        name: addName.value,
        country: addCountry.value
    };
    let lock = false;

    fetch(req)
        .then(response => response.json())
        .then(resource => {
            resource.forEach(city => {
                if (
                    city.name.toLowerCase() === newCity.name.toLowerCase() &&
                    city.country.toLowerCase() === newCity.country.toLowerCase()
                ) {
                    lock = true;
                }
            });
            if (lock) {
                throw new Error("Staden finns redan i listan!");
            }
            if (addName.value.trim() === "" || addCountry.value.trim() === "") {
                throw new Error("Skriv både namn och land för att lägga till en stad!");
            }
            return fetch(req, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCity)
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Något gick fel vid POST");
            }
            return response.json();
        })
        .then(resource => {
            let div1 = document.createElement("div");
            div1.classList.add("city");
            div1.textContent = `
            ${resource.name.charAt(0).toUpperCase() + resource.name.slice(1).toLowerCase()},
            ${resource.country.charAt(0).toUpperCase() + resource.country.slice(1).toLowerCase()}
            `;

            let div2 = document.createElement("div");
            div2.classList.add("delete_button");
            div2.textContent = "delete";

            cities.append(div1);
            div1.append(div2);
        })
        .catch(error => {
            console.error("Fel:", error.message);
        });
})


searchButton.addEventListener("click", function () {
    if (searchName.value.trim() != "" || searchCountry.value.trim() != "") {
        const allMatches = [];
        fetch(req)
            .then(response => response.json())
            .then(resource => {
                if (searchName.value.trim()) {
                    const nameMatches = resource.filter(city => city.name.toLowerCase().includes(searchName.value));
                    nameMatches.forEach(match => allMatches.push(match));
                }
                if (searchCountry.value.trim()) {
                    const countryMatches = resource.filter(city => city.country.toLowerCase().includes(searchCountry.value));
                    countryMatches.forEach(match => !allMatches.includes(match) ? allMatches.push(match) : null);
                }
                citySuggestions.innerHTML = "";
                if (allMatches.length) {
                    allMatches.forEach(match => {
                        let div = document.createElement("div");
                        div.classList.add("city");
                        div.textContent = `${match.name}, ${match.country}`;
                        citySuggestions.append(div);
                        citySuggestions.classList.add("city_suggestions");
                        citySuggestions.removeAttribute("id");
                    });
                } else {
                    let div = document.createElement("div");
                    div.setAttribute("id", "no_city");
                    div.textContent = "No cities found...";
                    citySuggestions.append(div);
                    citySuggestions.classList.add("city_suggestions");
                    citySuggestions.removeAttribute("id");
                }
            });
    }
})