const header = document.querySelector("header");
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
            div1.textContent = `${city.name}, ${city.country}`;

            let div2 = document.createElement("div");
            div2.classList.add("delete_button");
            div2.textContent = "delete";
            div2.addEventListener("click", function () {
                fetch(req, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(city)
                })
                    .then(response => {
                        div1.remove();
                    })
                    .then(resource => {
                        console.log(city);
                    })
            })

            cities.append(div1);
            div1.append(div2);
        })
    })

addButton.addEventListener("click", function () {
    const newCity = {
        name: addName.value,
        country: addCountry.value
    };

    return fetch(req, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCity)
    })
        .then(response => {
            return response.json();
        })
        .then(resource => {
            if (resource.id && resource.name && resource.country) {
                header.style.position = "absolute";
                header.textContent = "";

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
            } else {
                header.style.position = "relative";
                header.textContent = resource;
            }
        })
});



searchButton.addEventListener("click", function () {
    if (searchName.value || searchCountry.value) {
        let searchReq = "";
        if (searchName.value && searchCountry.value) {
            searchReq = new Request(`http://localhost:8000/cities/search?text=${searchName.value}&country=${searchCountry.value}`);
        } else if (searchName.value) {
            searchReq = new Request(`http://localhost:8000/cities/search?text=${searchName.value}`);
        }
        if (!searchReq) {
            citySuggestions.textContent = "";
            let div = document.createElement("div");
            div.setAttribute("id", "no_city");
            div.textContent = "No cities found";
            citySuggestions.append(div);
            citySuggestions.classList.add("city_suggestions");
            citySuggestions.removeAttribute("id");
            return;
        }

        async function searchResult() {
            const response = await fetch(searchReq);
            return await response.json();
        }

        async function driverSearchResult() {
            const resource = await searchResult();
            citySuggestions.textContent = "";
            if (resource.length) {
                resource.forEach(match => {
                    let div = document.createElement("div");
                    div.classList.add("city");
                    div.textContent = `${match.name}, ${match.country}`;
                    citySuggestions.append(div);
                    citySuggestions.classList.add("city_suggestions");
                    citySuggestions.removeAttribute("id");
                });
            } else {
                citySuggestions.textContent = "";
                let div = document.createElement("div");
                div.setAttribute("id", "no_city");
                div.textContent = "No cities found";
                citySuggestions.append(div);
                citySuggestions.classList.add("city_suggestions");
                citySuggestions.removeAttribute("id");
                return;
            }
        }
        return driverSearchResult();
    }
});