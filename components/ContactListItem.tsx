import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Contact } from "../services/database";

interface ContactListItemProps {
    contact: Contact;
}

export function ContactListItem({ contact }: ContactListItemProps) {
    const router = useRouter();

    // Lógica para extrair as iniciais do nome
    const initials = contact.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push(`/edit-contact/${contact.id}`)}
            className="flex-row items-center px-4 py-3 border-b border-gray-100 bg-white"
        >
            <View
                className={`w-12 h-12 rounded-full items-center justify-center ${contact.color || "bg-gray-400"
                    } mr-4 shadow-sm`}
            >
                <Text className="text-white font-bold text-lg">{initials}</Text>
            </View>
            <View className="flex-1">
                <Text className="text-gray-900 font-semibold text-base">
                    {contact.name}
                </Text>
                <Text className="text-gray-500 text-sm">{contact.phone}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
        </TouchableOpacity>
    );
}