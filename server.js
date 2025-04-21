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

    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: CORSheaders
        });
    }

    // GET & POST till /cities
    if (url.pathname === "/cities") {

        if (req.method === "GET") {
            return new Response(JSON.stringify(cities), {
                headers: CORSheaders,
                status: 200
            });

            if (req.method === "DELETE") {
                const match = idPattern.exec(req.url);
                const id = parseInt(match.pathname.groups.id);
                const index = cities.findIndex(city => city.id === id);

                if (index !== -1) {
                    cities.splice(index, 1);
                    return new Response(JSON.stringify({ message: `City ${id} deleted` }), {
                        headers: CORSheaders,
                        status: 200
                    });
                } else {
                    return new Response(JSON.stringify({ error: "City not found" }), {
                        headers: CORSheaders,
                        status: 404
                    });
                }
            }
        }

        if (req.method === "POST") {
            try {
                const body = await req.json();
                const newCity = {
                    id: cities[cities.length - 1].id + 1,
                    name: body.name,
                    country: body.country
                };
                cities.push(newCity);
                return new Response(JSON.stringify(newCity), {
                    headers: CORSheaders,
                    status: 200
                });
            } catch (error) {
                return new Response(JSON.stringify({ error: "Invalid JSON" }), {
                    headers: CORSheaders,
                    status: 400
                });
            }
        }
    }

    // DELETE till /cities/:id


    return new Response("Not Found", {
        status: 404,
        headers: CORSheaders
    });
}

Deno.serve(handler);


Deno.serve(handler);