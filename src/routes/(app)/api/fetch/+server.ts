export async function GET({request}) {
    //get the query string from the request
    const url = new URL(request.url);
    const query = url.searchParams.get("url");
    console.log(query);
    if (!query) {
        return new Response("Bad Request", { status: 400 });
    }
    //relay the response to the client
    return fetch(query, { cache: "no-cache" });
}