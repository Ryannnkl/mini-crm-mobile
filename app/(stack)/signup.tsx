import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { authClient } from '@/lib/auth-client';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

export default function SignUpScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Por favor, informe seu nome');
      return false;
    }

    if (!formData.email.trim()) {
      Alert.alert('Erro', 'Por favor, informe seu e-mail');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert('Erro', 'Por favor, informe um e-mail válido');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erro', 'As senhas não conferem');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      Alert.alert(
        'Cadastro realizado!',
        'Sua conta foi criada com sucesso. Verifique seu e-mail para ativar sua conta.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/signin')
          }
        ]
      );
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      Alert.alert('Erro', error.message || 'Não foi possível realizar o cadastro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Cadastre-se</ThemedText>
      
      <ThemedInput
        placeholder="Nome completo"
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
        autoCapitalize="words"
      />
      
      <ThemedInput
        placeholder="E-mail"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <ThemedInput
        placeholder="Senha"
        value={formData.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
      />
      
      <ThemedInput
        placeholder="Confirme sua senha"
        value={formData.confirmPassword}
        onChangeText={(text) => handleChange('confirmPassword', text)}
        secureTextEntry
        onSubmitEditing={handleSignUp}
      />
      
      <ThemedButton
        text="Criar conta"
        onPress={handleSignUp}
        isLoading={isLoading}
        disabled={isLoading}
      />
      <Link href="/signin" style={styles.link}>
        <ThemedText type="link">Já tem uma conta? Faça login</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 8
  },
  title: {
    marginBottom: 24,
    fontSize: 24,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 24,
  },
});
