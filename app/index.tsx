import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  SectionList,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data
const CONTACTS = [
  { id: "1", name: "Alice Johnson", phone: "(11) 98765-4321", color: "bg-blue-500" },
  { id: "2", name: "Bob Smith", phone: "(21) 91234-5678", color: "bg-green-500" },
  { id: "3", name: "Charlie Brown", phone: "(31) 99887-7665", color: "bg-purple-500" },
  { id: "4", name: "David Miller", phone: "(41) 97766-5544", color: "bg-amber-500" },
  { id: "5", name: "Eva Wilson", phone: "(51) 96655-4433", color: "bg-rose-500" },
  { id: "6", name: "Frank Wright", phone: "(61) 95544-3322", color: "bg-indigo-500" },
  { id: "7", name: "Grace Hopper", phone: "(71) 94433-2211", color: "bg-cyan-500" },
  { id: "8", name: "Henry Ford", phone: "(81) 93322-1100", color: "bg-orange-500" },
  { id: "9", name: "Ivy Chen", phone: "(91) 92211-0099", color: "bg-teal-500" },
  { id: "10", name: "Jack Sparrow", phone: "(12) 91100-9988", color: "bg-red-500" },
  { id: "11", name: "Kelly Clarkson", phone: "(22) 90099-8877", color: "bg-pink-500" },
  { id: "12", name: "Liam Neeson", phone: "(32) 99988-7766", color: "bg-violet-500" },
  { id: "13", name: "Mia Wallace", phone: "(42) 98877-6655", color: "bg-emerald-500" },
  { id: "14", name: "Noah Ark", phone: "(52) 97766-5544", color: "bg-sky-500" },
  { id: "15", name: "Olivia Rodrigo", phone: "(62) 96655-4433", color: "bg-fuchsia-500" },
  { id: "16", name: "Paul McCartney", phone: "(72) 95544-3322", color: "bg-lime-500" },
  { id: "17", name: "Quentin Tarantino", phone: "(82) 94433-2211", color: "bg-yellow-500" },
  { id: "18", name: "Rihanna", phone: "(92) 93322-1100", color: "bg-blue-600" },
  { id: "19", name: "Steve Jobs", phone: "(13) 92211-0099", color: "bg-slate-600" },
  { id: "20", name: "Taylor Swift", phone: "(23) 91100-9988", color: "bg-pink-600" },
];
const [search, setSearch] = useState("");
const router = useRouter();

const sections = useMemo(() => {
  const filtered = CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name));

  const groups: { [key: string]: any[] } = {};
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
}, [search]);

const renderItem = ({ item }: { item: (typeof CONTACTS)[0] }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    className="flex-row items-center px-4 py-3 border-b border-gray-100 bg-white"
  >
    <View
      className={`w-12 h-12 rounded-full items-center justify-center ${item.color} mr-4 shadow-sm`}
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

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="px-4 py-6">
        <Text className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Contatos
        </Text>
        {/* Search Bar */}
        <View className="mt-4 flex-row items-center bg-gray-100 rounded-xl px-3 py-2">
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
        keyExtractor={(item) => item.id}
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
              Nenhum contato encontrado
            </Text>
            <Text className="text-gray-500 text-center text-base">
              Não encontramos nenhum contato com o nome "{search}".
            </Text>
          </View>
        }
      />
      {/* add button */}
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