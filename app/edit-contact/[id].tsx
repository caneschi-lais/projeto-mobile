import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
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
import { formatPhone } from "../../services/utils";


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
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});

    useEffect(() => {
        const loadContact = async () => {
            try {
                const contact = await getContactById(contactId);
                if (contact) {
                    setName(contact.name);
                    setPhone(formatPhone(contact.phone));
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
            await updateContact(contactId, name.trim(), phone.trim(), email.trim());
            router.back();
        } catch (error) {
            console.error("Error updating contact:", error);
            Alert.alert("Erro", "Não foi possível atualizar o contato.");
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDelete = async () => {
        setIsDeleteModalVisible(false);
        setIsSaving(true);
        try {
            await deleteContact(contactId);
            router.back();
        } catch (error) {
            console.error("Error deleting contact:", error);
            Alert.alert("Erro", "Não foi possível excluir o contato.");
        } finally {
            setIsSaving(false);
        }
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
                        <TouchableOpacity onPress={() => setIsDeleteModalVisible(true)} className="mr-4">
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
                    <View className="space-y-4">
                        <View>
                            <Text className="text-gray-500 font-medium mb-2 ml-1">Nome Completo</Text>
                            <View className={`flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border ${errors.name ? 'border-red-500' : 'border-gray-100'}`}>
                                <Ionicons name="person-outline" size={20} color={errors.name ? "#EF4444" : "#94A3B8"} className="mr-3" />
                                <TextInput
                                    className="flex-1 text-gray-900 text-base ml-2"
                                    placeholder="Nome"
                                    placeholderTextColor="#94A3B8"
                                    value={name}
                                    onChangeText={(text) => {
                                        setName(text);
                                        if (errors.name) setErrors({ ...errors, name: undefined });
                                    }}
                                    editable={!isSaving}
                                />
                            </View>
                            {errors.name && <Text className="text-red-500 text-sm mt-1 ml-2">{errors.name}</Text>}
                        </View>

                        <View className="mt-4">
                            <Text className="text-gray-500 font-medium mb-2 ml-1">Telefone</Text>
                            <View className={`flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border ${errors.phone ? 'border-red-500' : 'border-gray-100'}`}>
                                <Ionicons name="call-outline" size={20} color={errors.phone ? "#EF4444" : "#94A3B8"} className="mr-3" />
                                <TextInput
                                    className="flex-1 text-gray-900 text-base ml-2"
                                    placeholder="Telefone"
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="phone-pad"
                                    value={phone}
                                    onChangeText={(text) => {
                                        setPhone(formatPhone(text));
                                        if (errors.phone) setErrors({ ...errors, phone: undefined });
                                    }}
                                    editable={!isSaving}

                                />
                            </View>
                            {errors.phone && <Text className="text-red-500 text-sm mt-1 ml-2">{errors.phone}</Text>}
                        </View>

                        <View className="mt-4">
                            <Text className="text-gray-500 font-medium mb-2 ml-1">E-mail</Text>
                            <View className={`flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border ${errors.email ? 'border-red-500' : 'border-gray-100'}`}>
                                <Ionicons name="mail-outline" size={20} color={errors.email ? "#EF4444" : "#94A3B8"} className="mr-3" />
                                <TextInput
                                    className="flex-1 text-gray-900 text-base ml-2"
                                    placeholder="E-mail"
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        if (errors.email) setErrors({ ...errors, email: undefined });
                                    }}
                                    editable={!isSaving}
                                />
                            </View>
                            {errors.email && <Text className="text-red-500 text-sm mt-1 ml-2">{errors.email}</Text>}
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

            {/* Custom Delete Confirmation Modal */}
            <Modal
                visible={isDeleteModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsDeleteModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50 px-6">
                    <View className="bg-white w-full rounded-3xl p-8 items-center shadow-2xl">
                        <View className="bg-red-50 p-4 rounded-full mb-4">
                            <Ionicons name="warning" size={32} color="#EF4444" />
                        </View>

                        <Text className="text-gray-900 text-2xl font-bold text-center mb-2">
                            Excluir Contato?
                        </Text>

                        <Text className="text-gray-500 text-base text-center mb-8 leading-6">
                            Tem certeza que deseja excluir o contato <Text className="font-bold text-gray-900">"{name}"</Text>? Esta ação não poderá ser desfeita.
                        </Text>

                        <View className="flex-row space-x-3 w-full gap-3">
                            <TouchableOpacity
                                onPress={() => setIsDeleteModalVisible(false)}
                                className="flex-1 bg-gray-100 py-4 rounded-2xl items-center"
                            >
                                <Text className="text-gray-600 font-bold text-lg">Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={confirmDelete}
                                className="flex-1 bg-red-600 py-4 rounded-2xl items-center shadow-lg shadow-red-200"
                            >
                                <Text className="text-white font-bold text-lg">Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}