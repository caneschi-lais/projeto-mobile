import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
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
import { deleteContact, getContactById, updateContact } from "../../services/database";

export default function EditContact() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const contactId = typeof id === 'string' ? parseInt(id) : 0;

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [color, setColor] = useState("bg-gray-500");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadContact = async () => {
            try {
                const contact = await getContactById(contactId);
                if (contact) {
                    setName(contact.name);
                    setPhone(contact.phone);
                    setEmail(contact.email);
                    setColor(contact.color);
                } else {
                    Alert.alert("Erro", "Contato não encontrado.");
                    router.back();
                }
            } catch (error) {
                console.error("Error loading contact:", error);
                Alert.alert("Erro", "Falha ao carregar contato.");
            } finally {
                setIsLoading(false);
            }
        };

        if (contactId) {
            loadContact();
        }
    }, [contactId]);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert("Erro", "Por favor, insira o nome do contato.");
            return;
        }

        setIsSaving(true);
        try {
            await updateContact(contactId, name.trim(), phone.trim(), email.trim());
            router.back();
        } catch (error) {
            console.error("Error updating contact:", error);
            Alert.alert("Erro", "Não foi possível atualizar o contato.");
        } finally {
            setIsSaving(false);
        }
    };
    const handleDelete = () => {
        Alert.alert(
            "Excluir Contato",
            "Tem certeza que deseja excluir este contato?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteContact(contactId);
                            router.back();
                        } catch (error) {
                            console.error("Error deleting contact:", error);
                            Alert.alert("Erro", "Não foi possível excluir o contato.");
                        }
                    }
                },
            ]
        );
    };
    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }
    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" />
            <Stack.Screen
                options={{
                    title: "Editar Contato",
                    headerShown: true,
                    headerBackTitle: "Voltar",
                    headerRight: () => (
                        <TouchableOpacity onPress={handleDelete} className="mr-4">
                            <Ionicons name="trash-outline" size={24} color="#EF4444" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-6 pt-8">
                    {/* Avatar Section */}
                    <View className="items-center mb-10 hidden">
                        <View className={`w-32 h-32 ${color} rounded-full items-center justify-center border-4 border-white shadow-sm`}>
                            <Text className="text-white font-bold text-4xl">
                                {name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .substring(0, 2)
                                    .toUpperCase()}
                            </Text>
                        </View>
                    </View>

                    {/* Form Fields */}
                    <View className="space-y-6">
                        <View>
                            <Text className="text-gray-500 font-medium mb-2 ml-1">Nome Completo</Text>
                            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border border-gray-100">
                                <Ionicons name="person-outline" size={20} color="#94A3B8" className="mr-3" />
                                <TextInput
                                    className="flex-1 text-gray-900 text-base ml-2"
                                    placeholder="Nome"
                                    placeholderTextColor="#94A3B8"
                                    value={name}
                                    onChangeText={setName}
                                    editable={!isSaving}
                                />
                            </View>
                        </View>

                        <View className="mt-4">
                            <Text className="text-gray-500 font-medium mb-2 ml-1">Telefone</Text>
                            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border border-gray-100">
                                <Ionicons name="call-outline" size={20} color="#94A3B8" className="mr-3" />
                                <TextInput
                                    className="flex-1 text-gray-900 text-base ml-2"
                                    placeholder="Telefone"
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="phone-pad"
                                    value={phone}
                                    onChangeText={setPhone}
                                    editable={!isSaving}
                                />
                            </View>
                        </View>

                        <View className="mt-4">
                            <Text className="text-gray-500 font-medium mb-2 ml-1">E-mail</Text>
                            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border border-gray-100">
                                <Ionicons name="mail-outline" size={20} color="#94A3B8" className="mr-3" />
                                <TextInput
                                    className="flex-1 text-gray-900 text-base ml-2"
                                    placeholder="E-mail"
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                    editable={!isSaving}
                                />
                            </View>
                        </View>
                    </View>
                    {/* Save Button */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleSave}
                        disabled={isSaving}
                        className={`mt-12 py-4 rounded-2xl items-center shadow-lg ${isSaving ? 'bg-gray-300 shadow-none' : 'bg-blue-600 shadow-blue-200'}`}
                    >
                        <Text className="text-white font-bold text-lg">
                            {isSaving ? "Salvando..." : "Salvar Alterações"}
                        </Text>
                    </TouchableOpacity>

                    <View className="h-20" />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}