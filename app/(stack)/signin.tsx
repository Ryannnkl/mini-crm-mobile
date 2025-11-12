import { ThemedButton } from "@/components/themed-button";
import { ThemedInput } from "@/components/themed-input";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { authClient } from "@/lib/auth-client";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  View
} from "react-native";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      if (!email || !password) {
        Alert.alert("Erro", "Por favor, preencha todos os campos.");
        return;
      }

      await authClient.signIn.email(
        {
          email,
          password,
          rememberMe: true,
        },
        {
          onSuccess: () => {
            router.replace("/(tabs)");
          },
          onError: (error) => {
            console.log("Erro no login:", error);
            Alert.alert(
              "Erro",
              "Não foi possível fazer login. Verifique suas credenciais e tente novamente."
            );
          },
        }
      );
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Erro",
        "Não foi possível fazer login. Verifique suas credenciais e tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Login
      </ThemedText>
      <ThemedInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <ThemedInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <ThemedButton text="Entrar" onPress={handleSignIn} isLoading={isLoading} disabled={isLoading} />
      </View>
      <Link href="/signup" style={styles.link}>
        <ThemedText type="link">Não tem uma conta? Cadastre-se</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 8
  },
  title: {
    marginBottom: 24,
  },
  buttonContainer: {
    width: "100%",
  },
  link: {
    marginTop: 24,
  },
});
