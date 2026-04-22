import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface EmptyStateProps {
    hasNoContacts: boolean;
    searchQuery: string;
}

export function EmptyState({ hasNoContacts, searchQuery }: EmptyStateProps) {
    return (
        <View className="items-center justify-center mt-20 px-8">
            <View className="bg-gray-50 p-6 rounded-full mb-4">
                <Ionicons name="people-outline" size={48} color="#CBD5E1" />
            </View>
            <Text className="text-gray-900 font-bold text-xl mb-2">
                {hasNoContacts ? "Nenhum contato salvo" : "Nenhum contato encontrado"}
            </Text>
            <Text className="text-gray-500 text-center text-base">
                {hasNoContacts
                    ? "Toque no botão '+' para adicionar seu primeiro contato."
                    : `Não encontramos nenhum contato com o nome "${searchQuery}".`}
            </Text>
        </View>
    );
}