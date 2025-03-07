import { PUBLIC_API_SERVER_URL } from "$env/static/public";
import { writeToDB } from "./db";

export async function fetchNoticesFromServer() {
    try {
        const response = await fetch(`${PUBLIC_API_SERVER_URL}/notices`);
        const json = await response.json();
        const notices = json.notices;
        if (!notices || notices instanceof Array === false || notices.length === 0) {
            return null;
        }
        await writeToDB("notices", "aiub", notices);
        return notices;
    } catch (err) {
        console.error(err);
        return null;
    }   
}