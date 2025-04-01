const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getRequest(endpoint: string, authToken?: string) {
    try {
        const response = await fetch(`${API_URL}/api/${endpoint}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
            },
            cache: "no-store",
        });

        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error(`Erreur API (GET ${endpoint}):`, error);
        return null;
    }
}

export async function postRequest(endpoint: string, body: any, authToken?: string) {
    try {
        const response = await fetch(`${API_URL}/api/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error(`Erreur API (POST ${endpoint}):`, error);
        return null;
    }
}
