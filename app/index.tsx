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

  const renderItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(`/edit-contact/${item.id}`)}
      className="flex-row items-center px-4 py-3 border-b border-gray-100 bg-white"
    >
      <View

        className={`w-12 h-12 rounded-full items-center justify-center ${item.color || 'bg-gray-400'} mr-4 shadow-sm`}
      >
        <Text className="text-white font-bold text-lg">
          {item.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-gray-900 font-semibold text-base">{item.name}</Text>
        <Text className="text-gray-500 text-sm">{item.phone}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
    </TouchableOpacity>
  );

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
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={true}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <View className="items-center justify-center mt-20 px-8">
            <View className="bg-gray-50 p-6 rounded-full mb-4">
              <Ionicons name="people-outline" size={48} color="#CBD5E1" />
            </View>
            <Text className="text-gray-900 font-bold text-xl mb-2">
              {contacts.length === 0 ? "Nenhum contato salvo" : "Nenhum contato encontrado"}
            </Text>
            <Text className="text-gray-500 text-center text-base">
              {contacts.length === 0
                ? "Toque no botão '+' para adicionar seu primeiro contato."
                : `Não encontramos nenhum contato com o nome "${search}".`}
            </Text>
          </View>
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