import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface FormFieldProps extends TextInputProps {
    label: string;
    iconName: keyof typeof Ionicons.glyphMap;
    error?: string;
}

export function FormField({ label, iconName, error, ...rest }: FormFieldProps) {
    return (
        <View className="mb-4">
            <Text className="text-gray-500 font-medium mb-2 ml-1">{label}</Text>
            <View
                className={`flex-row items-center bg-gray-50 rounded-2xl px-4 py-4 border ${error ? "border-red-500" : "border-gray-100"
                    }`}
            >
                <Ionicons
                    name={iconName}
                    size={20}
                    color={error ? "#EF4444" : "#94A3B8"}
                    className="mr-3"
                />
                <TextInput
                    className="flex-1 text-gray-900 text-base ml-2"
                    placeholderTextColor="#94A3B8"
                    {...rest}
                />
            </View>
            {error && (
                <Text className="text-red-500 text-sm mt-1 ml-2">{error}</Text>
            )}
        </View>
    );
}