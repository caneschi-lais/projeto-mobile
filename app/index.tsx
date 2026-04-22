import { Ionicons } from "@expo/vector-icons";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  SectionList,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { ContactListItem } from "../components/ContactListItem";
import { EmptyState } from "../components/EmptyState";
import { Contact, getContacts } from "../services/database";

export default function Index() {
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const router = useRouter();

  const loadContacts = useCallback(async () => {
    try {
      const data = await getContacts();
      setContacts(data);
    } catch (error) {
      console.error("Error loading contacts:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadContacts();
    }, [loadContacts])
  );

  const sections = useMemo(() => {
    const filtered = contacts.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name));

    const groups: { [key: string]: Contact[] } = {};
    filtered.forEach((contact) => {
      const firstLetter = contact.name[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(contact);
    });

    return Object.keys(groups)
      .sort()
      .map((letter) => ({
        title: letter,
        data: groups[letter],
      }));
  }, [search, contacts]);

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <View className="bg-gray-50 px-4 py-2">
      <Text className="text-gray-400 font-bold text-xs uppercase tracking-wider">
        {title}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: "Contatos",
          headerShown: true,
          headerLargeTitle: true,
          headerTransparent: false,
        }}
      />

      {/* Barra de Busca */}
      <View className="px-4 pb-4">
        <View className="mt-2 flex-row items-center bg-gray-100 rounded-xl px-3 py-2">
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-900"
            placeholder="Buscar contatos..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ContactListItem contact={item} />}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={true}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <EmptyState
            hasNoContacts={contacts.length === 0}
            searchQuery={search}
          />
        }
      />

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push("/create-contact")}
        className="absolute bottom-8 right-8 w-16 h-16 bg-blue-600 rounded-full items-center justify-center shadow-lg shadow-blue-400"
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}