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

    if (url.pathname.startsWith("/cities")) {
        if (url.pathname === "/cities") {
            if (req.method == "GET") {
                return new Response(JSON.stringify(cities), { status: 200, headers: jsonCORSHeaders });
            }
            if (req.method == "POST") {
                try {
                    const body = await req.json();
                    const duplicate = cities.some(city => city.name == body.name && city.country == body.country);
                    if (duplicate) {
                        return new Response(JSON.stringify("Staden du vill lägga till finns redan i listan"), {
                            headers: jsonCORSHeaders,
                            status: 409
                        });
                    }
                    const newCity = {
                        id: cities[cities.length - 1].id + 1,
                        name: body.name,
                        country: body.country
                    };
                    const hasNameAndCountry = newCity.name && newCity.country;
                    if (hasNameAndCountry) {
                        cities.push(newCity);
                        return new Response(JSON.stringify(newCity), {
                            headers: jsonCORSHeaders,
                            status: 200
                        });
                    }
                    if (!hasNameAndCountry) {
                        return new Response(JSON.stringify("Namn eller land saknas"), {
                            headers: jsonCORSHeaders,
                            status: 400
                        })
                    }
                } catch (error) {
                    console.error("Felaktig", error)
                }
            }
            if (req.method == "DELETE") {
                const body = await req.json();
                const idOk = body.id ? cities.some(city => city.id == body.id) : true

                if (!isNaN(Number(body.id)) && idOk) {
                    const bodyIndex = cities.findIndex(city => city.id === body.id);
                    cities.splice(bodyIndex, 1);
                    return new Response(JSON.stringify("Delete OK"), {
                        headers: jsonCORSHeaders,
                        status: 200
                    });
                }

                if (!idOk) {
                    return new Response(JSON.stringify("Not found"), { status: 404, headers: jsonCORSHeaders });
                }

                return new Response(JSON.stringify("Hittar inte staden du vill ta bort"), { status: 400, headers: CORSheaders });
            }
        }

        const match = idPattern.exec(url);
        const id = match.pathname.groups.id;

        if (!isNaN(Number(id))) {
            let target = cities.find(city => city.id == id);
            if (target) {
                return new Response(JSON.stringify(target), { status: 200, headers: jsonCORSHeaders });
            } else {
                return new Response(JSON.stringify("Not found"), { status: 404, headers: jsonCORSHeaders });
            }
        }

        if (url.pathname == "/cities/search") {
            if (req.method == "GET") {
                if (url.searchParams.has("text")) {
                    if (url.searchParams.has("country")) {
                        const regex1 = new RegExp(url.searchParams.get("text"), "i");
                        const regex2 = new RegExp(url.searchParams.get("country"), "i");
                        const match = cities.filter(city => regex1.test(city.name) && regex2.test(city.country));
                        return new Response(JSON.stringify(match), { status: 200, headers: jsonCORSHeaders });
                    } else {
                        const regex = new RegExp(url.searchParams.get("text"), "i");
                        const match = cities.filter(city => regex.test(city.name));
                        return new Response(JSON.stringify(match), { status: 200, headers: jsonCORSHeaders });
                    }
                } else {
                    return new Response(JSON.stringify("Text saknas"), { status: 400, headers: jsonCORSHeaders });
                }
            }
        }
    } else {
        return new Response(JSON.stringify("Ogiltig sökväg"), { status: 400, headers: jsonCORSHeaders });
    }

    return new Response(JSON.stringify("Not Found"), {
        status: 404,
        headers: jsonCORSHeaders
    });
}

Deno.serve(handler);