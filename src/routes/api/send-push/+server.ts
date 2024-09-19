import { PUBLIC_API_SERVER_URL } from '$env/static/public';


export async function POST({request}) {
    const data = await request.json();
    const api = PUBLIC_API_SERVER_URL;

    const response = await fetch(`${api}/push`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        }
    });

    const json = await response.json();

    if (json.status !== 'success') {
        return new Response(JSON.stringify(json), {status: 401});
    }

    return new Response(JSON.stringify(json), {status: 200});
}