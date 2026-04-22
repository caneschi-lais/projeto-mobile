const DB_NAME = 'contacts_db';
const DB_VERSION = 1;
const STORE_NAME = 'contacts';

export interface Contact {
    id: number;
    name: string;
    phone: string;
    email: string;
    color: string;
}

let dbInstance: IDBDatabase | null = null;

const getDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (dbInstance) return resolve(dbInstance);

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            dbInstance = request.result;
            resolve(request.result);
        };

        request.onupgradeneeded = (event: any) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };
    });
};

export const initializeDatabase = async () => {
    try {
        await getDB();
        console.log('IndexedDB initialized');
    } catch (error) {
        console.error('Failed to initialize IndexedDB:', error);
    }
};

export const getContacts = async (): Promise<Contact[]> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            // IndexedDB returns results in insertion order or index order.
            // We sort manually to match SQLite behavior.
            const results = request.result as Contact[];
            resolve(results.sort((a, b) => a.name.localeCompare(b.name)));
        };
        request.onerror = () => reject(request.error);
    });
};

export const getContactById = async (id: number): Promise<Contact | null> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
};


export const addContact = async (name: string, phone: string, email: string, color: string) => {
    const db = await getDB();
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add({ name, phone, email, color });

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const updateContact = async (id: number, name: string, phone: string, email: string) => {
    const db = await getDB();
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        // First get the existing contact to keep the color
        const getRequest = store.get(id);
        getRequest.onsuccess = () => {
            const contact = getRequest.result;
            if (contact) {
                const updatedContact = { ...contact, name, phone, email };
                const putRequest = store.put(updatedContact);
                putRequest.onsuccess = () => resolve();
                putRequest.onerror = () => reject(putRequest.error);
            } else {
                reject(new Error('Contact not found'));
            }
        };
        getRequest.onerror = () => reject(getRequest.error);
    });
};

export const deleteContact = async (id: number) => {
    const db = await getDB();
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};