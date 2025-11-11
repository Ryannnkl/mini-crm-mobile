import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
    baseURL: process.env.EXPO_PUBLIC_BETTER_AUTH_BASE_URL!,
    plugins: [
        expoClient({
            scheme: "mobile",
            storagePrefix: "mobile",
            storage: SecureStore,
        })
    ]
});