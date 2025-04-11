async function handler(req) {
    const method = req.method;

    const CORSheaders = new Headers();
    CORSheaders.append("Access-Control-Allow-Origin", "*");

    if (method == "GET") {
        return new Response("hej", { headers: CORSheaders, status: 200 });
    }
}

Deno.serve(handler);