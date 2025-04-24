const cities = [
    { id: 2, name: "Lille", country: "France" },
    { id: 3, name: "Nantes", country: "France" },
    { id: 5, name: "Bremen", country: "Germany" },
    { id: 10, name: "Dresden", country: "Germany" },
    { id: 11, name: "Heidelberg", country: "Germany" },
    { id: 12, name: "Venice", country: "Italy" },
    { id: 13, name: "Rome", country: "Italy" },
    { id: 16, name: "Graz", country: "Austria" },
    { id: 20, name: "Basel", country: "Switzerland" },
    { id: 21, name: "Lucerne", country: "Switzerland" },
    { id: 22, name: "Kraków", country: "Poland" },
    { id: 23, name: "Warsaw", country: "Poland" },
    { id: 24, name: "Poznań", country: "Poland" },
    { id: 28, name: "Ghent", country: "Belgium" },
    { id: 31, name: "Maastricht", country: "Netherlands" },
    { id: 38, name: "Maribor", country: "Slovenia" },
    { id: 42, name: "Strasbourg", country: "France" },
];

async function handler(req) {
    const url = new URL(req.url);
    const idPattern = new URLPattern({ pathname: "/cities/:id" });

    const CORSheaders = new Headers({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS"
    });

    const jsonCORSHeaders = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: CORSheaders,
        });
    }

    if (req.method === "GET") {
        if (url.pathname == "/cities") {
            return new Response(JSON.stringify(cities), {
                headers: CORSheaders,
                status: 200
            });
        }
        const match = idPattern.exec(url);
        if (!isNaN(Number(match.pathname.groups.id))) {
            try {
                const id = Number(match.pathname.groups.id);
                let target = cities.filter(city => city.id === id);
                target = target[0];
                return new Response(JSON.stringify(target), { status: 200, headers: jsonCORSHeaders });
            } catch (error) {
                throw new Error("error", error);
            }
        }
        if (url.searchParams.has("text") && url.searchParams.has("country")) {
            const regex1 = new RegExp(url.searchParams.get("text", "i"));
            const regex2 = new RegExp(url.searchParams.get("search", "i"));
            const match = cities.filter(city => regex1.test(city.name) && regex2.test(city.country));
            return new Response(JSON.stringify(match), { status: 200, headers: jsonCORSHeaders });
        } else if (url.searchParams.has("text")) {
            const regex = new RegExp(url.searchParams.get("text"), "i");
            const match = cities.filter(city => regex.test(city.name));
            return new Response(JSON.stringify(match), { status: 200, headers: jsonCORSHeaders });
        }
    }

    if (req.method === "POST") {
        if (url.pathname == "/cities") {
            try {
                const body = await req.json();
                const newCity = {
                    id: cities[cities.length - 1].id + 1,
                    name: body.name,
                    country: body.country
                };
                const duplicate = cities.some(city => city.name == newCity.name && city.country == newCity.country);
                const hasNameAndCountry = newCity.name && newCity.country;
                if (!duplicate && hasNameAndCountry) {
                    cities.push(newCity);
                    return new Response(JSON.stringify(newCity), {
                        headers: jsonCORSHeaders,
                        status: 200
                    });
                }
                if (duplicate) {
                    return new Response(JSON.stringify("Staden du vill lägga till finns redan i listan"), {
                        headers: CORSheaders,
                        status: 409
                    });
                }
                if (!hasNameAndCountry) {
                    return new Response(JSON.stringify("Måste finnas namn och land för att läggas till i listan"), {
                        headers: CORSheaders,
                        status: 400
                    })
                }
            } catch (error) {
                console.error("Felaktig", error)
            }
        }
    }

    if (req.method === "DELETE") {
        if (url.pathname == "/cities") {
            const body = await req.json();

            if (body.id == 2) {
                const targetIndex = cities.findIndex(city => city.id === body.id);
                cities.splice(targetIndex, 1);
                return new Response(JSON.stringify("Delete OK"), {
                    headers: CORSheaders,
                    status: 200
                });
            }

            const idMatch = body.id ? cities.some(city => city.id == body.id) : true;
            if (!idMatch) {
                return new Response(JSON.stringify("Not found"), { status: 404, headers: jsonCORSHeaders });
            }

            for (let city of cities) {
                if (city.name == body.name && city.country == body.country) {
                    cities.splice(city, 1);
                    return new Response(`Tog bort ${city} från listan`, { status: 202, headers: CORSheaders });
                }
            }
            return new Response(JSON.stringify("Ingen stad i listan matchar det du vill ta bort"), { status: 400, headers: CORSheaders });
        }
    }

    return new Response(JSON.stringify("Not Found"), {
        status: 404,
        headers: CORSheaders
    });
}

Deno.serve(handler);