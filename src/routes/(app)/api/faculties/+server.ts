

export async function GET() {
    //fetch('https://www.aiub.edu/Files/Uploads/public-employee-profiles/employeeProfiles.json');
    //relay the response to the client
    return fetch('https://www.aiub.edu/Files/Uploads/public-employee-profiles/employeeProfiles.json');
}