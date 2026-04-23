import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'contacts.db';
let database: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (database !== null) return database;

    database = await SQLite.openDatabaseAsync(DATABASE_NAME);

    await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      color TEXT
    );
  `);

    try {
        await database.execAsync(`ALTER TABLE contacts ADD COLUMN imageUri TEXT;`);
        console.log("Coluna imageUri adicionada com sucesso à tabela existente!");
    } catch (error) {
    }

    return database;
}

export interface Contact {
    id: number;
    name: string;
    phone: string;
    email: string;
    color: string;
    imageUri?: string;
}

export const getContacts = async (): Promise<Contact[]> => {
    const db = await getDatabase();
    return await db.getAllAsync<Contact>('SELECT * FROM contacts ORDER BY name ASC');
};

export const getContactById = async (id: number): Promise<Contact | null> => {
    const db = await getDatabase();
    return await db.getFirstAsync<Contact>('SELECT * FROM contacts WHERE id = ?', [id]);
};

export const addContact = async (name: string, phone: string, email: string, color: string, imageUri?: string) => {
    const db = await getDatabase();
    return await db.runAsync(
        'INSERT INTO contacts (name, phone, email, color, imageUri) VALUES (?, ?, ?, ?, ?)',
        [name, phone, email, color, imageUri || null]
    );
};

export const updateContact = async (id: number, name: string, phone: string, email: string, imageUri?: string) => {
    const db = await getDatabase();
    return await db.runAsync(
        'UPDATE contacts SET name = ?, phone = ?, email = ?, imageUri = ? WHERE id = ?',
        [name, phone, email, imageUri || null, id]
    );
};

export const deleteContact = async (id: number) => {
    const db = await getDatabase();
    return await db.runAsync('DELETE FROM contacts WHERE id = ?', [id]);
};