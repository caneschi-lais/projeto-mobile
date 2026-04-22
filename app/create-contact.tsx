import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateContact() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const handleSave = () => {
        console.log("Saving contact:", { name, phone, email });
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View className="px-4 py-4 flex-row items-center justify-between border-b border-gray-100">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="p-2 -ml-2"
                >
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900">Novo Contato</Text>
                <View className="w-10" />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-6 pt-8">
                    {/* Avatar Placeholder */}
                    <View className="items-center mb-10">
                        <View className="w-32 h-32 bg-gray-100 rounded-full items-center justify-center border-4 border-white shadow-sm">
                            <Ionicons name="camera" size={40} color="#94A3B8" />
                        </View>
                        <TouchableOpacity className="mt-4">
                            <Text className="text-blue-600 font-semibold">Adicionar Foto</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Fields */}
                    <View className="space-y-6">
                        <View>
                            <Text className="text-gray-500 font-medium mb-2 ml-1">Nome Completo</Text>
                            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border border-gray-100">
                                <Ionicons name="person-outline" size={20} color="#94A3B8" className="mr-3" />
                                <TextInput
                                    className="flex-1 text-gray-900 text-base ml-2"
                                    placeholder="Ex: Alice Johnson"
                                    placeholderTextColor="#94A3B8"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        </View>

                        <View className="mt-4">
                            <Text className="text-gray-500 font-medium mb-2 ml-1">Telefone</Text>
                            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border border-gray-100">
                                <Ionicons name="call-outline" size={20} color="#94A3B8" className="mr-3" />
                                <TextInput
                                    className="flex-1 text-gray-900 text-base ml-2"
                                    placeholder="(00) 00000-0000"
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="phone-pad"
                                    value={phone}
                                    onChangeText={setPhone}
                                />
                            </View>
                        </View>

                        <View className="mt-4">
                            <Text className="text-gray-500 font-medium mb-2 ml-1">E-mail</Text>
                            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border border-gray-100">
                                <Ionicons name="mail-outline" size={20} color="#94A3B8" className="mr-3" />
                                <TextInput
                                    className="flex-1 text-gray-900 text-base ml-2"
                                    placeholder="exemplo@email.com"
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleSave}
                        className="mt-12 bg-blue-600 py-4 rounded-2xl items-center shadow-lg shadow-blue-200"
                    >
                        <Text className="text-white font-bold text-lg">Salvar Contato</Text>
                    </TouchableOpacity>

                    <View className="h-20" />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}