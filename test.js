const rightContainer = document.getElementById("right");
const cities = document.getElementById("cities");
const addName = document.getElementById("add_name");
const addCountry = document.getElementById("add_country");
const addButton = document.getElementById("add_button");
const searchName = document.getElementById("search_name");
const searchCountry = document.getElementById("search_country");
const searchButton = document.getElementById("search_button");
const citySuggestions = document.getElementById("city_suggestions_hidden");

const req1 = new Request("http://localhost:8000/cities");

fetch(req1)
    .then(response => response.json())
    .then(resource => {
        resource.forEach(city => {
            let div1 = document.createElement("div");
            div1.classList.add("city");
            div1.textContent = `${city.name}, ${city.country}`;

            let div2 = document.createElement("div");
            div2.classList.add("delete_button");
            div2.textContent = "delete";

            cities.append(div1);
            div1.append(div2);
        })
    }
    );

addButton.addEventListener("click", function () {
    if (addName.value.trim() != "" && addCountry.value.trim() != "") {
        const newCity = {
            name: addName.value,
            country: addCountry.value
        };
        fetch(req1, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCity)
        })
            .then(response => response.json())
            .then(resource => {
                let div1 = document.createElement("div");
                div1.classList.add("city");
                div1.textContent = `${resource.name}, ${resource.country}`;

                let div2 = document.createElement("div");
                div2.classList.add("delete_button");
                div2.textContent = "delete";

                cities.append(div1);
                div1.append(div2);
            })
            .catch(error => { console.error("Något gick fel:", error) })
    }
})

searchButton.addEventListener("click", function () {
    if (searchName.value.trim() != "" || searchCountry.value.trim() != "") {
        const allMatches = [];
        fetch(req1)
            .then(response => response.json())
            .then(resource => {
                console.log(resource)
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
                    })
                }
            })
    };
})