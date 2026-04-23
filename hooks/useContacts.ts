import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import * as ContactRepository from '../services/database';

export function useContacts() {
    const [contacts, setContacts] = useState<ContactRepository.Contact[]>([]);
    const [loading, setLoading] = useState(true);

    const loadContacts = useCallback(async () => {
        try {
            setLoading(true);
            const data = await ContactRepository.getContacts();
            setContacts(data);
        } catch (error) {
            console.error("Erro ao carregar contatos:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadContacts();
        }, [loadContacts])
    );

    return { contacts, loading, loadContacts };
}