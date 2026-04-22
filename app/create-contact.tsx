import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormField } from "../components/FormField";
import { addContact } from "../services/database";
import { formatPhone } from "../services/utils";

const TAILWIND_COLORS = [
    "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-amber-500",
    "bg-rose-500", "bg-indigo-500", "bg-cyan-500", "bg-orange-500",
    "bg-teal-500", "bg-red-500", "bg-pink-500", "bg-violet-500",
    "bg-emerald-500", "bg-sky-500", "bg-fuchsia-500", "bg-lime-500"
];

export default function CreateContact() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});

    const validate = () => {
        const newErrors: { name?: string; phone?: string; email?: string } = {};

        if (!name.trim()) {
            newErrors.name = "O nome é obrigatório";
        } else if (name.trim().length < 3) {
            newErrors.name = "O nome deve ter pelo menos 3 caracteres";
        }

        if (!phone.trim()) {
            newErrors.phone = "O telefone é obrigatório";
        }

        if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "E-mail inválido";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        setIsSaving(true);
        try {
            const randomColor = TAILWIND_COLORS[Math.floor(Math.random() * TAILWIND_COLORS.length)];
            await addContact(name.trim(), phone.trim(), email.trim(), randomColor);
            router.back();
        } catch (error) {
            console.error("Error saving contact:", error);
            Alert.alert("Erro", "Não foi possível salvar o contato.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" />
            <Stack.Screen
                options={{
                    title: "Novo Contato",
                    headerShown: true,
                    headerBackTitle: "Voltar",
                }}
            />

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

                    <View className="space-y-4">
                        <FormField
                            label="Nome Completo"
                            iconName="person-outline"
                            placeholder="Ex: Alice Johnson"
                            value={name}
                            onChangeText={(text) => {
                                setName(text);
                                if (errors.name) setErrors({ ...errors, name: undefined });
                            }}
                            error={errors.name}
                            editable={!isSaving}
                        />

                        <FormField
                            label="Telefone"
                            iconName="call-outline"
                            placeholder="(00) 00000-0000"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={(text) => {
                                setPhone(formatPhone(text));
                                if (errors.phone) setErrors({ ...errors, phone: undefined });
                            }}
                            error={errors.phone}
                            editable={!isSaving}
                        />

                        <FormField
                            label="E-mail"
                            iconName="mail-outline"
                            placeholder="exemplo@email.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (errors.email) setErrors({ ...errors, email: undefined });
                            }}
                            error={errors.email}
                            editable={!isSaving}
                        />
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleSave}
                        disabled={isSaving}
                        className={`mt-12 py-4 rounded-2xl items-center shadow-lg ${isSaving ? 'bg-gray-300 shadow-none' : 'bg-blue-600 shadow-blue-200'}`}
                    >
                        <Text className="text-white font-bold text-lg">
                            {isSaving ? "Salvando..." : "Salvar Contato"}
                        </Text>
                    </TouchableOpacity>

                    <View className="h-20" />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}