
export async function GET() {
    const url = "https://www.aiub.edu/academic-calendar";
    const response = await fetch(url, { cache: "no-cache" });
    const text = await response.text();

    return new Response(text, {
        headers: {
            "content-type": "text/html; charset=utf-8"
        }
    });
}