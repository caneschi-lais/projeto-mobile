import { Stack } from "expo-router";
import { useEffect } from "react";
import { initializeDatabase } from "../services/database";

import "../global.css";

export default function RootLayout() {
  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 20,
          color: '#111827', // gray-900
        },
        headerTintColor: '#2563eb', // blue-600
        headerTitleAlign: 'center',
      }}
    />
  );
}