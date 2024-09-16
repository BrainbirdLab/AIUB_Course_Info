//make a read/write endpoint using cachestorage

export async function writeToDB(dbName: string, key: string, data: any) {
    try {
        const cache = await caches.open(dbName);
        const response = new Response(JSON.stringify(data));
        await cache.put(key, response);
        return true;
    } catch (_) {
        return false;
    }
}

export async function readFromDB(dbName: string, key: string) {
    try {
        const cache = await caches.open(dbName);
        const response = await cache.match(key);
        if (response) {
            return response.json();
        }
        return null;
    } catch (_) {
        return null;
    }
}

export async function deleteFromDB(dbName: string, key: string) {
    try {
        const cache = await caches.open(dbName);
        await cache.delete(key);
        return true;
    } catch (_) {
        return false;
    }
}

export async function clearDB(dbName: string) {
    try {
        const cache = await caches.open(dbName);
        await cache.keys().then(keys => {
            keys.forEach(key => {
                cache.delete(key);
            });
        });
        return true;
    } catch (_) {
        return false;
    }
}

export async function updateValue(dbName: string, key: string, value: any) {
    try {
        const cache = await caches.open(dbName);
        const response = await cache.match(key);
        if (response) {
            const data = await response.json();
            const newData = { ...data, ...value };
            await writeToDB(dbName, key, newData);
            return true;
        }
        return false;
    } catch (_) {
        return false;
    }
}