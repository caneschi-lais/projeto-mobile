import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('contacts.db');

export const initializeDatabase = async () => {
    db.execSync(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      color TEXT
    );
  `);
};


export interface Contact {
    id: number;
    name: string;
    phone: string;
    email: string;
    color: string;
}

export const getContacts = async (): Promise<Contact[]> => {
    return await db.getAllAsync<Contact>('SELECT * FROM contacts ORDER BY name ASC');
};

export const getContactById = async (id: number): Promise<Contact | null> => {
    return await db.getFirstAsync<Contact>('SELECT * FROM contacts WHERE id = ?', [id]);
};


export const addContact = async (name: string, phone: string, email: string, color: string) => {
    return await db.runAsync(
        'INSERT INTO contacts (name, phone, email, color) VALUES (?, ?, ?, ?)',
        [name, phone, email, color]
    );
};

export const updateContact = async (id: number, name: string, phone: string, email: string) => {
    return await db.runAsync(
        'UPDATE contacts SET name = ?, phone = ?, email = ? WHERE id = ?',
        [name, phone, email, id]
    );
};

export const deleteContact = async (id: number) => {
    return await db.runAsync('DELETE FROM contacts WHERE id = ?', [id]);
};