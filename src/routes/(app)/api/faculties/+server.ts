

export async function GET() {
    //relay the response to the client
    return fetch('https://www.aiub.edu/Files/Uploads/public-employee-profiles/employeeProfiles.json', { cache: "no-cache" });
}